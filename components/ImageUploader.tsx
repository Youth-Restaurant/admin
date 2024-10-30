import React, { useCallback } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
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
  // useImageUpload 훅을 사용하여 이미지 업로드 관련 상태와 핸들러 관리
  const { previewUrl, isLoading, handleImageSelect, handleImageRemove } =
    useImageUpload({
      maxSizeMB,
      maxUploadSizeMB,
      maxWidthOrHeight,
      onUploadSuccess: onImageUpload,
      onUploadError: () => onImageRemove(),
    });

  /**
   * 파일 입력 변경 이벤트 핸들러
   * 선택된 파일이 있는 경우 이미지 업로드 프로세스를 시작합니다.
   *
   * @param e - 파일 입력 변경 이벤트
   */
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
      {/* 전체 컴포넌트를 감싸는 카드 */}
      <Card className='w-full'>
        <CardContent className='p-3'>
          {/* 이미지가 업로드된 경우 미리보기 표시 */}
          {previewUrl ? (
            <div className='relative flex justify-center'>
              {/* 이미지 미리보기 컨테이너 */}
              <div className='relative w-32 h-32 rounded-md overflow-hidden'>
                <Image
                  src={previewUrl}
                  alt='Preview'
                  fill
                  className='object-cover'
                />
              </div>
              {/* 이미지 제거 버튼 */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size='icon'
                    variant='secondary'
                    className='absolute -top-2 -right-2 h-6 w-6 rounded-full'
                    onClick={handleImageRemove}
                  >
                    <X className='h-3 w-3' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>이미지 제거</p>
                </TooltipContent>
              </Tooltip>
            </div>
          ) : (
            // 이미지가 없는 경우 업로드 인터페이스 표시
            <label className='relative block'>
              {/* 파일 선택 영역 */}
              <div className='flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-md border-muted-foreground/25 hover:border-muted-foreground/40 transition-colors cursor-pointer'>
                {/* 숨겨진 파일 입력 */}
                <input
                  type='file'
                  className='hidden'
                  accept='image/*' // 이미지 파일만 허용
                  onChange={handleFileChange}
                  disabled={isLoading}
                />
                {/* 로딩 상태 또는 업로드 안내 표시 */}
                {isLoading ? (
                  <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
                ) : (
                  <div className='flex flex-col items-center gap-1.5'>
                    <Upload className='h-6 w-6 text-muted-foreground' />
                    <span className='text-sm text-muted-foreground font-medium'>
                      이미지 업로드
                    </span>
                    <span className='text-xs text-muted-foreground/70'>
                      이미지 파일 ({maxUploadSizeMB}MB 이하)
                    </span>
                  </div>
                )}
              </div>
            </label>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
