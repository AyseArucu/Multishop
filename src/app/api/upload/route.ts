export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'Dosya bulunamadı' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename
    const uniqueName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;

    // If Supabase is configured, upload to Supabase Storage
    if (supabase) {
      const { data: uploadData, error } = await supabase
        .storage
        .from('uploads') // We assume the user creates a bucket named "uploads"
        .upload(uniqueName, buffer, {
          contentType: file.type,
          upsert: true
        });

      if (error) {
        console.error("Supabase Upload Error:", error);
        return NextResponse.json({ success: false, error: 'Supabase yüklemesi başarısız oldu' }, { status: 500 });
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage.from('uploads').getPublicUrl(uniqueName);
      
      return NextResponse.json({ success: true, url: publicUrlData.publicUrl });
    }

    // Fallback: Local Upload (Only works locally, NOT on Vercel)
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    
    // Ensure directory exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // directory probably exists
    }

    const path = join(uploadDir, uniqueName);
    await writeFile(path, buffer);

    // Return the public URL
    return NextResponse.json({ success: true, url: `/uploads/${uniqueName}` });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ success: false, error: 'Yükleme sırasında sunucu hatası oluştu' }, { status: 500 });
  }
}
