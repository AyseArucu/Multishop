import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import CookieBanner from "@/components/CookieBanner";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"] });

import prisma from '@/lib/prisma';
import { generateColorPalette } from '@/lib/colorUtils';

export async function generateMetadata(): Promise<Metadata> {
  let title = "MultiShop | Premium E-Commerce";
  let icon = "";

  try {
    const settings = await prisma.setting.findMany({
      where: { key: { in: ['siteTitle', 'siteFavicon'] } }
    });
    const siteTitle = settings.find(s => s.key === 'siteTitle')?.value;
    const siteFavicon = settings.find(s => s.key === 'siteFavicon')?.value;
    
    if (siteTitle) title = siteTitle;
    if (siteFavicon) icon = siteFavicon;
  } catch (error) {
    console.error("Metadata error:", error);
  }

  return {
    title,
    description: "Modern, şık ve renkli alışveriş deneyimi",
    icons: { icon: '/api/favicon?v=' + (icon ? encodeURIComponent(icon) : 'default') },
  };
}

export const dynamic = "force-dynamic";
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch global theme color, default to pink (#ea5a8b)
  let themeColor = '#ea5a8b';
  try {
    const themeSetting = await prisma.setting.findUnique({ where: { key: 'globalThemeColor' } });
    if (themeSetting?.value) themeColor = themeSetting.value;
  } catch (error) {
    console.error("Theme layout error:", error);
  }
  
  // Generate the 11-shade palette for CSS variables
  const palette = generateColorPalette(themeColor);
  
  // Construct CSS variables object
  const cssVars: any = {};
  for (const [shade, rgb] of Object.entries(palette)) {
    cssVars[`--color-primary-${shade}`] = rgb;
  }

  return (
    <html lang="tr">
      <body style={cssVars} className={`${outfit.className} antialiased bg-slate-50 text-slate-900`}>
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
