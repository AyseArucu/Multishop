import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get('active') === 'true';

    const pages = await prisma.page.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, pages });
  } catch (error) {
    console.error("GET Pages Error:", error);
    return NextResponse.json({ error: "Sayfalar getirilemedi." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, slug, content, isActive } = body;

    if (!title || !slug || !content) {
      return NextResponse.json({ error: "Lütfen tüm zorunlu alanları doldurun." }, { status: 400 });
    }

    const newPage = await prisma.page.create({
      data: {
        title,
        slug,
        content,
        isActive: isActive !== undefined ? isActive : true,
      }
    });

    return NextResponse.json({ success: true, page: newPage }, { status: 201 });
  } catch (error: any) {
    console.error("POST Page Error:", error);
    if (error.code === 'P2002') {
       return NextResponse.json({ error: "Bu URL (slug) zaten kullanılıyor." }, { status: 400 });
    }
    return NextResponse.json({ error: "Sayfa oluşturulamadı." }, { status: 500 });
  }
}
