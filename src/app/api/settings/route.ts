import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await prisma.setting.findMany();
    const settingsMap = settings.reduce((acc: any, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    
    if (!settingsMap['marqueeText']) settingsMap['marqueeText'] = "✨ SEZONUN EN TREND PARÇALARINDA %50'YE VARAN İNDİRİM ✨";
    if (!settingsMap['marqueeColor']) settingsMap['marqueeColor'] = "#000000";
    if (!settingsMap['sliderArrowColor']) settingsMap['sliderArrowColor'] = "#ff1493";
    if (!settingsMap['sliderArrowStyle']) settingsMap['sliderArrowStyle'] = "default";

    return NextResponse.json(settingsMap);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    for (const [key, value] of Object.entries(body)) {
      if (typeof value === 'string') {
        await prisma.setting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        });
      }
    }
    
    revalidatePath('/', 'layout');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
