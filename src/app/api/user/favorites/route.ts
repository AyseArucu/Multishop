export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const favorites = await prisma.favorite.findMany({
      where: { userEmail: email }
    });

    const itemIds = favorites.map(f => f.productId);

    return NextResponse.json({ items: itemIds });
  } catch (error) {
    console.error("GET Favorites Error:", error);
    return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, action, items, productId } = body;

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    if (action === 'sync') {
      // Merge local favorite ids with db
      const existing = await prisma.favorite.findMany({ where: { userEmail: email } });
      const dbIds = existing.map(f => f.productId);
      
      const allIds = new Set([...dbIds, ...(items || [])]);

      await prisma.favorite.deleteMany({ where: { userEmail: email } });
      if (allIds.size > 0) {
        await prisma.favorite.createMany({
          data: Array.from(allIds).map(id => ({ userEmail: email, productId: id }))
        });
      }
      
      return NextResponse.json({ success: true, items: Array.from(allIds) });
    }

    if (action === 'add') {
      const existing = await prisma.favorite.findUnique({
        where: { userEmail_productId: { userEmail: email, productId } }
      });
      if (!existing) {
        await prisma.favorite.create({
          data: { userEmail: email, productId }
        });
      }
      return NextResponse.json({ success: true });
    }

    if (action === 'remove') {
      await prisma.favorite.deleteMany({
        where: { userEmail: email, productId }
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("POST Favorites Error:", error);
    return NextResponse.json({ error: "Failed to update favorites" }, { status: 500 });
  }
}
