import React, { useCallback } from 'react';
import { X, Loader2, Plus } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useImageUpload } from '@/hooks/useImageUpload';

/**
 * ImageUploader 컴포넌트의 Props 인터페이스
 * @interface ImageUploaderProps
 * @property {function} onImageUpload - 이미지 업로드 성공 시 호출되는 콜백 함수 (URL 전달)
 * @property {function} onImageRemove - 이미지 제거 시 호출되는 콜백 함수
 * @property {number} [maxSizeMB=1] - 압축 후 이미지의 최대 크기 (MB)
 * @property {number} [maxUploadSizeMB=5] - 업로드 허용되는 원본 이미지의 최대 크기 (MB)
 * @property {number} [maxWidthOrHeight=1920] - 이미지의 최대 너비 또는 높이 (픽셀)
 */
interface ImageUploaderProps {
  onImageUpload: (url: string) => void;
  onImageRemove: () => void;
  maxSizeMB?: number;
  maxUploadSizeMB?: number;
  maxWidthOrHeight?: number;
}

/**
 * 이미지 업로드 컴포넌트
 *
 * 이미지 파일을 선택하여 업로드하고 미리보기를 제공하는 컴포넌트입니다.
 * 선택된 이미지는 자동으로 압축되며, 서버에 업로드됩니다.
 *
 * 주요 기능:
 * - 이미지 파일 선택 및 미리보기 표시
 * - 이미지 자동 압축 및 리사이징
 * - 파일 크기 제한 및 유효성 검사
 * - 드래그 앤 드롭 인터페이스
 * - 업로드 진행 상태 표시
 * - 업로드된 이미지 제거
 *
 * 사용 예시:
 * ```tsx
 * <ImageUploader
 *   onImageUpload={(url) => handleImageUrl(url)}
 *   onImageRemove={() => handleImageRemove()}
 *   maxSizeMB={0.8}
 *   maxUploadSizeMB={5}
 * />
 * ```
 */
export default function ImageUploader({
  onImageUpload,
  onImageRemove,
  maxSizeMB = 1,
  maxUploadSizeMB = 5,
  maxWidthOrHeight = 1920,
}: ImageUploaderProps) {
  const { previewUrl, isLoading, handleImageSelect, handleImageRemove } =
    useImageUpload({
      maxSizeMB,
      maxUploadSizeMB,
      maxWidthOrHeight,
      onUploadSuccess: onImageUpload,
      onUploadError: () => onImageRemove(),
    });

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        await handleImageSelect(file);
      }
    },
    [handleImageSelect]
  );

  return (
    <TooltipProvider>
      <Card className='w-[70px]'>
        <CardContent className='p-0'>
          <div className='relative'>
            {/* X 버튼을 label 밖으로 이동 */}
            {previewUrl && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size='icon'
                    variant='secondary'
                    className='absolute -top-2 -right-2 h-6 w-6 rounded-full z-10'
                    onClick={handleImageRemove}
                  >
                    <X className='h-3 w-3' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>이미지 제거</p>
                </TooltipContent>
              </Tooltip>
            )}
            {/* 파일 선택을 위한 label과 input */}
            <label className='block'>
              <input
                type='file'
                className='hidden'
                accept='image/*'
                onChange={handleFileChange}
                disabled={isLoading}
              />
              {previewUrl ? (
                <div className='relative w-[70px] h-[70px]'>
                  <div className='w-full h-full cursor-pointer'>
                    <Image
                      src={previewUrl}
                      alt='Preview'
                      fill
                      className={`object-cover rounded-md ${
                        isLoading ? 'opacity-50' : ''
                      }`}
                    />
                    {isLoading && (
                      <div className='absolute inset-0 flex items-center justify-center bg-black/20 rounded-md'>
                        <Loader2 className='h-6 w-6 animate-spin text-white' />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className='flex items-center justify-center w-[70px] h-[70px] bg-gray-100 hover:bg-gray-200 transition-colors rounded-md cursor-pointer'>
                  {isLoading ? (
                    <Loader2 className='h-6 w-6 animate-spin text-gray-400' />
                  ) : (
                    <Plus className='h-6 w-6 text-gray-400' />
                  )}
                </div>
              )}
            </label>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
