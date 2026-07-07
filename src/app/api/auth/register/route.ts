import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { name, phone, email, password, hasAcceptedConsent } = await req.json();

    if (!name || !email || !password || !hasAcceptedConsent) {
      return NextResponse.json({ success: false, error: 'Lütfen zorunlu tüm alanları doldurun.' }, { status: 400 });
    }

    let user = await prisma.user.findUnique({
      where: { email }
    });

    if (user) {
      return NextResponse.json({ success: false, error: 'Bu e-posta adresi ile kayıtlı bir hesap zaten var.' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        password: hashedPassword,
        hasAcceptedConsent: true,
        consentDate: new Date(),
        isApproved: false // Yeni üyeler onaya düşer
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Hesabınız başarıyla oluşturuldu, yönetici onayı bekleniyor.",
      user: { id: user.id, email: user.email, name: user.name } 
    });

  } catch (error) {
    console.error("Auth Register Error:", error);
    return NextResponse.json({ success: false, error: 'Kayıt işlemi başarısız oldu.' }, { status: 500 });
  }
}
