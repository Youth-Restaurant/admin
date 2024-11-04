import { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { useToast } from '@/hooks/use-toast';

/**
 * useImageUpload 훅의 옵션 인터페이스
 * @interface UseImageUploadOptions
 * @property {number} [maxSizeMB=1] - 압축 후 이미지의 최대 크기 (MB)
 * @property {number} [maxUploadSizeMB=5] - 업로드 허용되는 원본 이미지의 최대 크기 (MB)
 * @property {number} [maxWidthOrHeight=1920] - 이미지의 최대 너비 또는 높이 (픽셀)
 * @property {function} [onUploadSuccess] - 업로드 성공 시 호출되는 콜백 함수
 * @property {function} [onUploadError] - 업로드 실패 시 호출되는 콜백 함수
 */
interface UseImageUploadOptions {
  maxSizeMB?: number;
  maxUploadSizeMB?: number;
  maxWidthOrHeight?: number;
  onUploadSuccess?: (url: string) => void;
  onUploadError?: (error: Error) => void;
}

/**
 * useImageUpload 훅의 반환값 인터페이스
 * @interface UseImageUploadResult
 * @property {string | null} previewUrl - 이미지 미리보기 URL
 * @property {boolean} isLoading - 업로드 진행 상태
 * @property {function} handleImageSelect - 이미지 선택 처리 함수
 * @property {function} handleImageRemove - 이미지 제거 처리 함수
 */
interface UseImageUploadResult {
  previewUrl: string | null;
  isLoading: boolean;
  handleImageSelect: (file: File) => Promise<void>;
  handleImageRemove: () => void;
}

/**
 * 파일의 확장자를 추출하는 유틸리티 함수
 * 파일명이나 MIME 타입을 기반으로 적절한 확장자를 결정
 *
 * @param {File} file - 확장자를 추출할 파일 객체
 * @returns {string} 추출된 확장자 (기본값: 'jpg')
 */
const getFileExtension = (file: File): string => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  const mimeTypeExtensions: { [key: string]: string } = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
  };

  if (
    extension &&
    ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)
  ) {
    return extension;
  }

  return mimeTypeExtensions[file.type] || 'jpg';
};

/**
 * 이미지 파일을 압축하는 함수
 * browser-image-compression 라이브러리를 사용하여 이미지를 압축
 *
 * @param {File} file - 압축할 이미지 파일
 * @param {Object} options - 압축 옵션
 * @param {number} options.maxSizeMB - 압축 후 최대 파일 크기 (MB)
 * @param {number} options.maxWidthOrHeight - 압축 후 최대 너비/높이 (픽셀)
 * @returns {Promise<File>} 압축된 이미지 파일
 */
const compressImage = async (
  file: File,
  options: { maxSizeMB: number; maxWidthOrHeight: number }
): Promise<File> => {
  try {
    const compressedFile = await imageCompression(file, {
      ...options,
      useWebWorker: true,
    });

    const extension = getFileExtension(file);
    const originalName = file.name.split('.')[0];
    const newFileName = `${originalName}-compressed.${extension}`;

    return new File([compressedFile], newFileName, {
      type: compressedFile.type,
    });
  } catch (error) {
    console.error('Error compressing image:', error);
    throw error;
  }
};

/**
 * 압축된 이미지를 서버에 업로드하는 함수
 *
 * @param {File} file - 업로드할 이미지 파일
 * @returns {Promise<string>} 업로드된 이미지의 URL
 * @throws {Error} 업로드 실패 시 에러
 */
const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('extension', getFileExtension(file));

  const response = await fetch('/api/storage', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  const data = await response.json();
  return data.url;
};

/**
 * 이미지 업로드 관련 기능을 제공하는 커스텀 훅
 *
 * 주요 기능:
 * - 이미지 파일 유효성 검사
 * - 이미지 압축
 * - 서버 업로드
 * - 미리보기 생성/제거
 * - 로딩 상태 관리
 * - 에러 처리 및 사용자 피드백
 *
 * @example
 * ```tsx
 * const {
 *   previewUrl,
 *   isLoading,
 *   handleImageSelect,
 *   handleImageRemove
 * } = useImageUpload({
 *   maxSizeMB: 1,
 *   onUploadSuccess: (url) => console.log(url)
 * });
 * ```
 */
export const useImageUpload = ({
  maxSizeMB = 1,
  maxUploadSizeMB = 5,
  maxWidthOrHeight = 1920,
  onUploadSuccess,
  onUploadError,
}: UseImageUploadOptions = {}): UseImageUploadResult => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  /**
   * 이미지 파일의 유효성을 검사하는 함수
   * - 파일 타입 검사
   * - 파일 크기 검사
   *
   * @param {File} file - 검사할 이미지 파일
   * @returns {boolean} 유효성 검사 통과 여부
   */
  const validateImage = (file: File): boolean => {
    const validImageTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
    ];

    if (!validImageTypes.includes(file.type)) {
      toast({
        variant: 'destructive',
        title: 'Invalid file type',
        description:
          'Please upload a valid image file (JPG, PNG, GIF, WebP, SVG)',
      });
      return false;
    }

    if (file.size > maxUploadSizeMB * 1024 * 1024) {
      toast({
        variant: 'destructive',
        title: 'File too large',
        description: `Image size should be less than ${maxUploadSizeMB}MB`,
      });
      return false;
    }

    return true;
  };

  /**
   * 이미지 선택 처리 함수
   * 파일 유효성 검사, 압축, 업로드, 미리보기 생성을 순차적으로 처리
   *
   * @param {File} file - 선택된 이미지 파일
   */
  const handleImageSelect = async (file: File): Promise<void> => {
    if (!validateImage(file)) return;

    try {
      setIsLoading(true);

      const compressedFile = await compressImage(file, {
        maxSizeMB,
        maxWidthOrHeight,
      });
      console.log(
        'Original file:',
        file.name,
        '(',
        file.size / 1024 / 1024,
        'MB)'
      );
      console.log(
        'Compressed file:',
        compressedFile.name,
        '(',
        compressedFile.size / 1024 / 1024,
        'MB)'
      );

      const imageUrl = await uploadImage(compressedFile);
      setPreviewUrl(imageUrl);
      onUploadSuccess?.(imageUrl);

      toast({
        title: 'Success',
        description: 'Image uploaded successfully',
      });
    } catch (error) {
      console.error('Error handling image:', error);
      const uploadError =
        error instanceof Error ? error : new Error('Failed to upload image');

      onUploadError?.(uploadError);

      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: 'Failed to upload image. Please try again.',
      });

      handleImageRemove();
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 이미지 제거 처리 함수
   * 미리보기 URL을 해제하고 상태를 초기화
   */
  const handleImageRemove = (): void => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return {
    previewUrl,
    isLoading,
    handleImageSelect,
    handleImageRemove,
  };
};
