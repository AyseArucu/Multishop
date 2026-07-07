export const dynamic = 'force-dynamic';
import { ImageResponse } from 'next/og';
import prisma from '@/lib/prisma';
import { join } from 'path';
import { readFile } from 'fs/promises';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const setting = await prisma.setting.findUnique({ where: { key: 'siteFavicon' } });
    const iconUrl = setting?.value;

    if (iconUrl && iconUrl.startsWith('/uploads/')) {
      const filename = iconUrl.replace('/uploads/', '');
      const filepath = join(process.cwd(), 'public', 'uploads', filename);
      const fileBuffer = await readFile(filepath);
      const base64 = fileBuffer.toString('base64');
      const ext = filename.split('.').pop()?.toLowerCase();
      const mime = ext === 'png' ? 'image/png' : (ext === 'jpg' || ext === 'jpeg') ? 'image/jpeg' : 'image/x-icon';
      const dataUrl = `data:${mime};base64,${base64}`;

      return new ImageResponse(
        (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              borderRadius: '50%',
              overflow: 'hidden',
            }}
          >
            <img src={dataUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ),
        { width: 64, height: 64 }
      );
    } else if (iconUrl && iconUrl.startsWith('http')) {
      return new ImageResponse(
        (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              borderRadius: '50%',
              overflow: 'hidden',
            }}
          >
            <img src={iconUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ),
        { width: 64, height: 64 }
      );
    }
  } catch (error) {
    console.error("Favicon error", error);
  }

  // Fallback icon
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ea5a8b', borderRadius: '50%', color: 'white', fontSize: '32px', fontWeight: 'bold' }}>
        M
      </div>
    ),
    { width: 64, height: 64 }
  );
}
