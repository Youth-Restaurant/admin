'use client';

import { useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Toaster } from '@/components/ui/toaster';

export default function UploadPage() {
  const [imageUrl, setImageUrl] = useState<string>('');

  const handleImageUpload = (url: string) => {
    setImageUrl(url);
  };

  const handleImageRemove = () => {
    setImageUrl('');
  };

  return (
    <div className='container mx-auto p-4 max-w-xl'>
      <Card>
        <CardHeader>
          <CardTitle>Image Upload</CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col items-center gap-4'>
          <ImageUploader
            onImageUpload={handleImageUpload}
            onImageRemove={handleImageRemove}
          />
          {imageUrl && (
            <div className='w-full'>
              <p className='text-sm text-muted-foreground'>
                Uploaded image URL:
              </p>
              <p className='text-xs text-muted-foreground/70 break-all mt-1'>
                {imageUrl}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}
