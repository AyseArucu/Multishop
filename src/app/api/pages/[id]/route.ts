import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const page = await prisma.page.findUnique({
      where: { id: params.id }
    });

    if (!page) {
      return NextResponse.json({ error: "Sayfa bulunamadı." }, { status: 404 });
    }

    return NextResponse.json({ success: true, page });
  } catch (error) {
    console.error("GET Page Error:", error);
    return NextResponse.json({ error: "Sayfa getirilemedi." }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { title, slug, content, isActive } = body;

    const updatedPage = await prisma.page.update({
      where: { id: params.id },
      data: {
        title,
        slug,
        content,
        isActive,
      }
    });

    return NextResponse.json({ success: true, page: updatedPage });
  } catch (error: any) {
    console.error("PUT Page Error:", error);
    if (error.code === 'P2002') {
       return NextResponse.json({ error: "Bu URL (slug) zaten kullanılıyor." }, { status: 400 });
    }
    return NextResponse.json({ error: "Sayfa güncellenemedi." }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.page.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Page Error:", error);
    return NextResponse.json({ error: "Sayfa silinemedi." }, { status: 500 });
  }
}
