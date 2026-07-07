import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { isApproved } = body;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isApproved }
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("PUT User Error:", error);
    return NextResponse.json({ error: "Kullanıcı durumu güncellenirken bir hata oluştu." }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Prisma şemasında User -> Order (ve Order -> OrderItem) vb. 
    // işlemleri için referans bütünlüğü var.
    // Ancak User'ı sildiğimizde, Prisma cascade ayarlı değilse order'lar da silinmeli.
    // Eğer Order modelinde onDelete: Cascade yoksa elle silmeliyiz.
    // Güvenli olması adına önce Order'ları siliyoruz (onDelete: Cascade varsa bu satır ekstra güvenliktir)
    
    // Yorum satırı: orderları ve reviewleri silmek gerekebilir. 
    // Cascade yoksa Prisma silmeye izin vermeyecektir.
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.cartItem.deleteMany({ where: { userEmail: user.email } }),
      prisma.favorite.deleteMany({ where: { userEmail: user.email } }),
      prisma.orderItem.deleteMany({ where: { order: { userId: id } } }),
      prisma.order.deleteMany({ where: { userId: id } }),
      prisma.review.deleteMany({ where: { userId: id } }),
      prisma.user.delete({ where: { id } })
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE User Error:", error);
    return NextResponse.json({ error: "Kullanıcı silinirken bir hata oluştu. Lütfen bağlantılı verileri kontrol edin." }, { status: 500 });
  }
}
