import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userEmail: email },
      include: { product: true }
    });

    const formattedItems = cartItems.map(item => ({
      id: item.productId,
      name: item.product.title,
      price: item.product.price,
      image: item.product.images[0] || '',
      quantity: item.quantity,
      variant: item.variant || 'Standard'
    }));

    return NextResponse.json({ items: formattedItems });
  } catch (error) {
    console.error("GET Cart Error:", error);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, action, items, item, productId, variant, quantity } = body;

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    if (action === 'sync') {
      // Merge client items with DB items
      const existingItems = await prisma.cartItem.findMany({ where: { userEmail: email } });
      
      const mergedMap = new Map<string, any>();
      // Add existing DB items
      for (const dbItem of existingItems) {
        mergedMap.set(`${dbItem.productId}-${dbItem.variant || 'Standard'}`, {
          productId: dbItem.productId,
          variant: dbItem.variant || 'Standard',
          quantity: dbItem.quantity
        });
      }
      // Add or update from client items
      if (items && Array.isArray(items)) {
        for (const clientItem of items) {
          const key = `${clientItem.id}-${clientItem.variant || 'Standard'}`;
          if (mergedMap.has(key)) {
            const existing = mergedMap.get(key);
            mergedMap.set(key, {
              ...existing,
              quantity: existing.quantity + clientItem.quantity
            });
          } else {
            mergedMap.set(key, {
              productId: clientItem.id,
              variant: clientItem.variant || 'Standard',
              quantity: clientItem.quantity
            });
          }
        }
      }

      // Replace DB with merged
      await prisma.cartItem.deleteMany({ where: { userEmail: email } });
      if (mergedMap.size > 0) {
        await prisma.cartItem.createMany({
          data: Array.from(mergedMap.values()).map(val => ({
            userEmail: email,
            productId: val.productId,
            variant: val.variant,
            quantity: val.quantity
          }))
        });
      }

      const updatedItems = await prisma.cartItem.findMany({
        where: { userEmail: email },
        include: { product: true }
      });

      const formattedItems = updatedItems.map(dbItem => ({
        id: dbItem.productId,
        name: dbItem.product.title,
        price: dbItem.product.price,
        image: dbItem.product.images[0] || '',
        quantity: dbItem.quantity,
        variant: dbItem.variant || 'Standard'
      }));

      return NextResponse.json({ success: true, items: formattedItems });
    }
    
    if (action === 'add') {
      const existing = await prisma.cartItem.findFirst({
        where: { userEmail: email, productId: item.id, variant: item.variant || 'Standard' }
      });
      if (existing) {
        await prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + (item.quantity || 1) }
        });
      } else {
        await prisma.cartItem.create({
          data: {
            userEmail: email,
            productId: item.id,
            variant: item.variant || 'Standard',
            quantity: item.quantity || 1
          }
        });
      }
      return NextResponse.json({ success: true });
    }

    if (action === 'remove') {
      await prisma.cartItem.deleteMany({
        where: { userEmail: email, productId, variant: variant || 'Standard' }
      });
      return NextResponse.json({ success: true });
    }
    
    if (action === 'updateQuantity') {
      const existing = await prisma.cartItem.findFirst({
        where: { userEmail: email, productId, variant: variant || 'Standard' }
      });
      if (existing) {
        await prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity }
        });
      }
      return NextResponse.json({ success: true });
    }

    if (action === 'clear') {
      await prisma.cartItem.deleteMany({ where: { userEmail: email } });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("POST Cart Error:", error);
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
  }
}
