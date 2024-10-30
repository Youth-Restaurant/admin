// pages/api/upload.ts 또는 app/api/upload/route.ts
export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_FILE_STORAGE_URL}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }
    const data = await response.json();

    return Response.json(data);
  } catch (error) {
    console.error('Upload failed:', error);
    return Response.json({ error: 'Upload failed' }, { status: 500 });
  }
}
