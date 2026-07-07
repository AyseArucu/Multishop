export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, password, hasAcceptedConsent } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'E-posta ve şifre gereklidir.' }, { status: 400 });
    }

    let user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'Kullanıcı bulunamadı.' }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password) || (user.password === 'nopassword' && password === 'nopassword');

    if (!isPasswordValid) {
      return NextResponse.json({ success: false, error: 'Hatalı şifre.' }, { status: 401 });
    }

    if (!user.isApproved) {
      return NextResponse.json({ success: false, error: 'Hesabınız henüz yönetici tarafından onaylanmadı.' }, { status: 403 });
    }

    // Update consent if needed
    if (hasAcceptedConsent && !user.hasAcceptedConsent) {
      user = await prisma.user.update({
        where: { email },
        data: {
          hasAcceptedConsent: true,
          consentDate: new Date()
        }
      });
    }

    return NextResponse.json({ success: true, user: { id: user.id, email: user.email, name: user.name } });

  } catch (error) {
    console.error("Auth Login Error:", error);
    return NextResponse.json({ success: false, error: 'Giriş işlemi başarısız oldu.' }, { status: 500 });
  }
}
