import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                images: true
              }
            }
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json({ error: "Sipariş bulunamadı." }, { status: 404 });
    }

    // Müşteri gizliliği için user bilgisini dahil etmiyoruz.
    // Sadece siparişin durumu ve kargo bilgilerini dönüyoruz.
    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        status: order.status,
        createdAt: order.createdAt,
        totalAmount: order.totalAmount,
        trackingCompany: order.trackingCompany,
        trackingNumber: order.trackingNumber,
        items: order.orderItems
      }
    });
  } catch (error) {
    console.error("GET Track Order Error:", error);
    return NextResponse.json({ error: "Sunucu hatası oluştu." }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();

    if (body.action === 'CANCEL') {
      const order = await prisma.order.findUnique({ where: { id }, include: { user: true } });
      if (!order) return NextResponse.json({ error: "Sipariş bulunamadı." }, { status: 404 });
      
      // Ensure the user owns the order
      if (body.email && order.user.email !== body.email) {
        return NextResponse.json({ error: "Bu işlemi yapmaya yetkiniz yok." }, { status: 403 });
      }

      if (order.status !== 'PENDING') return NextResponse.json({ error: "Sadece 'Sipariş Alındı' durumundaki siparişler iptal edilebilir." }, { status: 400 });

      const updatedOrder = await prisma.order.update({
        where: { id },
        data: { 
          status: 'CANCELLED',
          cancelReason: 'Müşteri Tarafından İptal Edildi'
        }
      });

      return NextResponse.json({ success: true, order: updatedOrder });
    }
    
    return NextResponse.json({ error: "Geçersiz işlem." }, { status: 400 });
  } catch (error) {
    console.error("PATCH Track Order Error:", error);
    return NextResponse.json({ error: "Sunucu hatası oluştu." }, { status: 500 });
  }
}
