import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { trackingCompany, trackingNumber, status } = body;

    // Build the update object dynamically
    const updateData: any = {};
    if (trackingCompany !== undefined) updateData.trackingCompany = trackingCompany;
    if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;
    if (status !== undefined) {
      if (!Object.values(OrderStatus).includes(status)) {
        return NextResponse.json({ error: "Geçersiz sipariş durumu." }, { status: 400 });
      }
      updateData.status = status as OrderStatus;
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("PUT Order Error:", error);
    return NextResponse.json({ error: "Sipariş güncellenirken bir hata oluştu." }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    await prisma.order.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Order Error:", error);
    return NextResponse.json({ error: "Sipariş silinirken bir hata oluştu." }, { status: 500 });
  }
}
