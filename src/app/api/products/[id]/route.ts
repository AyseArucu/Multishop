import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { 
        category: true,
        reviews: {
          where: { isApproved: true },
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    // Fetch similar products in the same category
    let similarProducts = await prisma.product.findMany({
      where: { 
        categoryId: product.categoryId,
        id: { not: id }
      },
      include: { category: true },
      take: 20 // Fetch up to 20 to randomize from
    });
    
    // Randomize the fetched products and pick top 10
    similarProducts = similarProducts.sort(() => 0.5 - Math.random()).slice(0, 10);
    
    return NextResponse.json({ product, similarProducts });
  } catch (error) {
    console.error("GET Product Error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { title, description, price, originalPrice, stock, categoryId, images, videoUrl, showVideoInSlider, colors, sizes, colorImages, colorPrices, storeInfo, deliveryInfo, installmentInfo, productDetails, isNew, isDiscounted } = body;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        title,
        description,
        price: parseFloat(price) || 0,
        originalPrice: originalPrice ? parseFloat(originalPrice.toString()) : null,
        stock: parseInt(stock, 10) || 0,
        category: categoryId ? { connect: { id: categoryId } } : undefined,
        images: images || [],
        videoUrl: videoUrl !== undefined ? videoUrl : undefined,
        showVideoInSlider: showVideoInSlider !== undefined ? showVideoInSlider : undefined,
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
      include: { category: true }
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("PUT Product Error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Product Error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
