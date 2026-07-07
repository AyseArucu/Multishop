import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        orderItems: {
          include: {
            product: true,
            variant: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error("GET Orders Error:", error);
    return NextResponse.json({ error: "Siparişler getirilemedi." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, totalAmount, paymentMethod, firstName, lastName, phone, email, address } = body;

    // Find or create a guest user (temporary solution since auth is not implemented)
    let user = await prisma.user.findFirst({ where: { email: email || 'guest@multishop.local' } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: `${firstName} ${lastName}`,
          email: email || 'guest@multishop.local',
          password: 'nopassword',
        }
      });
    }

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        totalAmount,
        paymentMethod: paymentMethod || 'CREDIT_CARD',
        firstName,
        lastName,
        phone,
        email,
        address,
        orderItems: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      }
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("POST Order Error:", error);
    return NextResponse.json({ error: "Sipariş oluşturulamadı." }, { status: 500 });
  }
}
