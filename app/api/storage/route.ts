import { createClient } from '@supabase/supabase-js';
// pages/api/storage.ts 또는 app/api/storage/route.ts

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const fileName = formData.get('fileName') as string;

    // ☁️ **Supabase에 업로드**
    const { data, error } = await supabase.storage
      .from('inventory') // 스토리지 버킷 이름
      .upload(`uploads/${fileName}`, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'image/jpeg',
      });

    console.log(data, error);

    if (error) {
      throw new Error('Upload failed');
    }
    return Response.json(data);
  } catch (error) {
    console.error('Upload failed:', error);
    return Response.json({ error: 'Upload failed' }, { status: 500 });
  }
}
