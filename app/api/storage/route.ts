import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';
// pages/api/storage.ts 또는 app/api/storage/route.ts

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as Blob;
    const fileName = formData.get('fileName') as string;
    const bucket = formData.get('bucket') as string;
    if (!file || !fileName)
      throw new Error('파일 또는 파일 이름이 유효하지 않습니다.');

    // ⚠️ 파일 이름 검증 (공격 방지)
    // if (!fileName.match(/^[\w\-.]+$/)) {
    //   return new Response(
    //     JSON.stringify({
    //       error: '파일 이름에 유효하지 않은 문자가 포함되어 있습니다.',
    //     }),
    //     { status: 400 }
    //   );
    // }

    // 📦 Blob → Buffer 변환
    const buffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);

    // ☁️ Supabase에 업로드
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(`${fileName}`, uint8Array, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading image:', error);
      throw new Error(error.message);
    }

    console.log('업로드 성공:', data);
    return new Response(JSON.stringify({ url: data.path }), {
      status: 200,
    });
  } catch (err) {
    console.error('서버 오류:', err);
    const errorMessage = err instanceof Error ? err.message : '서버 오류 발생';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
    });
  }
}

export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get('path');
  const { data } = await supabase.storage
    .from('inventory')
    .getPublicUrl(path as string);

  return new Response(JSON.stringify({ url: data.publicUrl }), {
    status: 200,
  });
}
