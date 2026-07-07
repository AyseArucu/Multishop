import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, email, rating, comment } = body;

    if (!productId || !email || !comment) {
      return NextResponse.json({ error: "Eksik bilgi gönderildi." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim() }
    });

    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı. Lütfen giriş yapın." }, { status: 401 });
    }

    const newReview = await prisma.review.create({
      data: {
        userId: user.id,
        productId,
        rating: parseInt(rating) || 5,
        comment: comment.trim(),
        isApproved: false // Varsayılan olarak onaysız (admin onayından geçmeli)
      }
    });

    return NextResponse.json({ success: true, review: newReview });
  } catch (error) {
    console.error("POST Review Error:", error);
    return NextResponse.json({ error: "Yorum gönderilirken bir hata oluştu." }, { status: 500 });
  }
}
