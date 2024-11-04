// pages/api/storage.ts 또는 app/api/storage/route.ts
export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_FILE_STORAGE_URL}/storage`,
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
