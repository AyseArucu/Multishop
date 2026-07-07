import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: 'homeCategoriesConfig' }
    });

    let config = {
      showMixed: false,
      mixedTitle: "Öne Çıkan Ürünler",
      limitMode: "all",
      selectedIds: [] as string[],
      maxCount: 0
    };

    if (setting && setting.value) {
      try {
        config = { ...config, ...JSON.parse(setting.value) };
      } catch (e) {}
    }

    let whereClause: any = {
      isActive: true,
      products: { some: {} } // Only categories that have at least one product
    };

    if (config.limitMode === 'custom' && config.selectedIds.length > 0) {
      whereClause.id = { in: config.selectedIds };
    }

    let categories = await prisma.category.findMany({
      where: whereClause,
      include: {
        products: {
          take: 10, // Max 10 products per category for the slider
          orderBy: { createdAt: 'desc' },
          include: { category: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    // Apply max count if specified
    if (config.maxCount > 0 && categories.length > config.maxCount) {
      categories = categories.slice(0, config.maxCount);
    }

    // Add Mixed Category if enabled
    if (config.showMixed) {
      const mixedProducts = await prisma.product.findMany({
        take: 15,
        orderBy: { createdAt: 'desc' },
        include: { category: true }
      });

      if (mixedProducts.length > 0) {
        const mixedCategory = {
          id: 'mixed-category',
          name: config.mixedTitle || "Karışık Ürünler",
          slug: '',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          products: mixedProducts
        };
        // Prepend mixed category
        categories = [mixedCategory as any, ...categories];
      }
    }

    return NextResponse.json({ categories });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch categories with products" }, { status: 500 });
  }
}
