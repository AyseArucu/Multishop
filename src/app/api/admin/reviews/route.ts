import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        user: { select: { name: true, email: true } },
        product: { select: { title: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    console.error("GET Admin Reviews Error:", error);
    return NextResponse.json({ error: "Yorumlar getirilirken hata oluştu." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, isApproved, adminReply } = body;

    if (!id) {
      return NextResponse.json({ error: "Yorum ID'si eksik." }, { status: 400 });
    }

    const updateData: any = {};
    if (isApproved !== undefined) updateData.isApproved = isApproved;
    if (adminReply !== undefined) updateData.adminReply = adminReply;

    const updatedReview = await prisma.review.update({
      where: { id },
      data: updateData,
      include: {
        user: { select: { name: true, email: true } },
        product: { select: { title: true } }
      }
    });

    return NextResponse.json({ success: true, review: updatedReview });
  } catch (error) {
    console.error("PATCH Admin Reviews Error:", error);
    return NextResponse.json({ error: "Yorum güncellenirken hata oluştu." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Yorum ID'si eksik." }, { status: 400 });
    }

    await prisma.review.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Admin Reviews Error:", error);
    return NextResponse.json({ error: "Yorum silinirken hata oluştu." }, { status: 500 });
  }
}
