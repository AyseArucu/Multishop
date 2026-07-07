export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const setting = await prisma.setting.findUnique({ where: { key: 'siteFavicon' } });
    const iconUrl = setting?.value;

    if (iconUrl && iconUrl.startsWith('http')) {
      const resp = await fetch(iconUrl);
      const buffer = await resp.arrayBuffer();
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': resp.headers.get('content-type') || 'image/x-icon',
          'Cache-Control': 'public, max-age=86400'
        }
      });
    }
  } catch (error) {
    console.error("Favicon error", error);
  }

  // Fallback SVG icon
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">
    <rect width="64" height="64" rx="32" fill="#ea5a8b"/>
    <text x="32" y="44" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white" text-anchor="middle">M</text>
  </svg>`;
  
  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400'
    }
  });
}
