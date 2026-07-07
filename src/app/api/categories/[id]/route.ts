import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { name, isActive, slug, imageUrl } = body;

    const dataToUpdate: any = {};
    if (name !== undefined) dataToUpdate.name = name;
    if (isActive !== undefined) dataToUpdate.isActive = isActive;
    if (slug !== undefined) dataToUpdate.slug = slug;
    if (imageUrl !== undefined) dataToUpdate.imageUrl = imageUrl;

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: dataToUpdate
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("PUT Category Error:", error);
    return NextResponse.json({ error: "Kategori güncellenirken bir hata oluştu" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    // Check if category has products
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    if (!category) {
      return NextResponse.json({ error: "Kategori bulunamadı" }, { status: 404 });
    }

    if (category._count.products > 0) {
      return NextResponse.json(
        { error: `Bu kategoriye bağlı ${category._count.products} adet ürün bulunuyor. Lütfen önce ürünleri silin veya kategorilerini değiştirin.` }, 
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Category Error:", error);
    return NextResponse.json({ error: "Kategori silinirken bir hata oluştu" }, { status: 500 });
  }
}
