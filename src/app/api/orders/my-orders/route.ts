import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: "E-posta adresi gereklidir." }, { status: 400 });
    }

    const orders = await prisma.order.findMany({
      where: {
        email: email
      },
      include: {
        orderItems: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("GET My Orders Error:", error);
    return NextResponse.json({ error: "Siparişler getirilemedi." }, { status: 500 });
  }
}
