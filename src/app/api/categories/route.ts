import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
}

export async function GET(req?: Request) {
  try {
    let includeAll = false;
    if (req && req.url) {
      const url = new URL(req.url);
      includeAll = url.searchParams.get("all") === "true";
    }

    const categories = await prisma.category.findMany({
      where: includeAll ? undefined : { isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        isActive: true,
        parentId: true,
        imageUrl: true,
        _count: {
          select: { products: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("GET Categories Error:", error);
    return NextResponse.json({ error: "Kategoriler yüklenirken bir hata oluştu" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, isActive, parentId, imageUrl } = body;
    
    if (!name) return NextResponse.json({ error: "Kategori adı zorunludur" }, { status: 400 });

    let slug = slugify(name);
    if (!slug) slug = `category-${Date.now()}`;

    // Handle duplicate slug
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const newCategory = await prisma.category.create({
      data: { 
        name, 
        slug,
        isActive: isActive !== undefined ? isActive : true,
        parentId: parentId || null,
        imageUrl: imageUrl || null
      }
    });
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("POST Category Error:", error);
    return NextResponse.json({ error: "Kategori oluşturulurken bir hata oluştu" }, { status: 500 });
  }
}

