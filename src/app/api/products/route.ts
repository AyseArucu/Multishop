import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const color = searchParams.get('color');
    const discount = searchParams.get('discount');
    const searchQuery = searchParams.get('search');
    const inStock = searchParams.get('inStock');
    const size = searchParams.get('size');

    let whereClause: any = {};
    const andClauses: any[] = [];

    if (searchQuery) {
      whereClause.title = { contains: searchQuery };
    }

    const idsString = searchParams.get('ids');
    if (idsString) {
      whereClause.id = { in: idsString.split(',') };
    }

    if (category) {
      whereClause.categoryId = category;
    }
    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price.gte = parseFloat(minPrice);
      if (maxPrice) whereClause.price.lte = parseFloat(maxPrice);
    }
    if (inStock === 'true') {
      whereClause.stock = { gt: 0 };
    }
    if (color) {
      andClauses.push({
        OR: [
          { colors: { has: color } },
          { variants: { some: { name: "Renk", value: color } } }
        ]
      });
    }
    if (size) {
      andClauses.push({
        OR: [
          { sizes: { has: size } },
          { variants: { some: { name: "Beden", value: size } } }
        ]
      });
    }
    if (discount === 'true') {
      andClauses.push({
        OR: [
          { isDiscounted: true },
          { originalPrice: { not: null } }
        ]
      });
    }

    if (andClauses.length > 0) {
      whereClause.AND = andClauses;
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });
    
    let categories = await prisma.category.findMany();
    
    // If no categories exist, create a default one to prevent empty dropdowns
    if (categories.length === 0) {
       const defaultCat = await prisma.category.create({ data: { name: "Genel" } });
       categories = [defaultCat];
    }
    
    return NextResponse.json({ products, categories });
  } catch (error) {
    console.error("GET Products Error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, price, originalPrice, stock, categoryId, images, videoUrl, showVideoInSlider, colors, sizes, colorImages, colorPrices, storeInfo, deliveryInfo, installmentInfo, productDetails, isNew, isDiscounted } = body;

    // Validation
    if (!title || !description || price === undefined || stock === undefined) {
      return NextResponse.json({ error: "Lütfen tüm zorunlu alanları doldurun." }, { status: 400 });
    }

    let validCategoryId = categoryId;

    if (!validCategoryId) {
      let defaultCat = await prisma.category.findFirst({ where: { name: "Genel" } });
      if (!defaultCat) {
        defaultCat = await prisma.category.create({ data: { name: "Genel", slug: "genel" } });
      }
      validCategoryId = defaultCat.id;
    }

    const newProduct = await prisma.product.create({
      data: {
        title,
        description,
        price: parseFloat(price.toString()),
        originalPrice: originalPrice ? parseFloat(originalPrice.toString()) : null,
        stock: parseInt(stock.toString()),
        category: { connect: { id: validCategoryId } },
        images: images || [],
        videoUrl: videoUrl || null,
        showVideoInSlider: showVideoInSlider !== undefined ? showVideoInSlider : true,
        colors: colors || [],
        sizes: sizes || [],
        colorImages: colorImages || {},
        colorPrices: colorPrices || {},
        storeInfo,
        deliveryInfo,
        installmentInfo,
        productDetails,
        isNew: !!isNew,
        isDiscounted: !!isDiscounted,
      },
      include: {
        category: true,
      }
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("POST Product Error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
