'use client';
import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { Upload } from 'lucide-react';
import {
  UploadSupplyItem,
  UploadFoodItem,
  SupplyCategoryType,
  FoodCategoryType,
  InventoryType,
  InventoryItem,
} from '@/types/inventory';
import { LocationSelect } from './LocationSelect';
import { CategorySelect } from './CategorySelect';
import { SupplyFields } from './SupplyFields';
import { FoodFields } from './FoodFields';
import ImageUploader from '@/components/ImageUploader';
import InventoryTab from '@/components/inventory/InventoryTab';
import RequiredIndicator from '@/components/\bRequiredIndicator';
import { $Enums, SupplyLocation, FoodLocation } from '@prisma/client';
import { useSession } from 'next-auth/react';

type InventoryUploadModalProps = {
  isLoading?: boolean;
  onSubmit: (data: UploadSupplyItem | UploadFoodItem) => Promise<void>;
};

type CommonFields = Pick<
  InventoryItem,
  | 'name'
  | 'quantity'
  | 'status'
  | 'createdBy'
  | 'memo'
  | 'imageUrl'
  | 'updatedBy'
>;

type FormState = Record<InventoryType, UploadSupplyItem | UploadFoodItem>;

const getInitialCommonFields = (createdBy: string): CommonFields => ({
  name: '',
  quantity: undefined,
  status: 'SUFFICIENT' as const,
  createdBy,
  updatedBy: createdBy || '',
  memo: '',
  imageUrl: '',
});

const getTypeSpecificFields = (type: InventoryType) => {
  if (type === 'SUPPLY') {
    return {
      type: 'SUPPLY' as const,
      location: '' as SupplyLocation,
      category: '' as SupplyCategoryType,
      manufacturer: '',
      modelNumber: '',
    };
  } else {
    return {
      type: 'FOOD' as const,
      location: '' as FoodLocation,
      category: '' as FoodCategoryType,
      expirationDate: undefined,
    };
  }
};

const dialogContentClassName =
  'w-[min(calc(100vw-40px),460px)] max-h-[85vh] overflow-hidden';

const isValidName = (name: string): boolean => {
  if (name.trim().length === 0) return false;

  const incompleteHangulRegex = /^[ㄱ-ㅎㅏ-ㅣ]+$/;
  if (incompleteHangulRegex.test(name)) return false;

  const specialCharsRegex = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]+$/;
  if (specialCharsRegex.test(name)) return false;

  const numbersOnlyRegex = /^\d+$/;
  if (numbersOnlyRegex.test(name)) return false;

  const whitespaceRegex = /^\s+$/;
  if (whitespaceRegex.test(name)) return false;

  return true;
};

export default function InventoryUploadModal({
  isLoading = false,
  onSubmit,
}: InventoryUploadModalProps) {
  const session = useSession();

  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTab, setSelectedTab] =
    useState<$Enums.InventoryType>('SUPPLY');
  const [commonFields, setCommonFields] = useState<CommonFields>(
    getInitialCommonFields('')
  );
  const [typeSpecificFields, setTypeSpecificFields] = useState(
    getTypeSpecificFields(selectedTab)
  );

  useEffect(() => {
    const id = session.data?.user.id;
    if (id) {
      setCommonFields((prev) => ({
        ...prev,
        createdBy: id,
        updatedBy: id,
      }));
    }
  }, [session.data?.user.id]);

  const formData = {
    ...commonFields,
    ...typeSpecificFields,
  } as FormState[typeof selectedTab];

  // 필수 필드 검증
  const isFormValid = useMemo(() => {
    const commonFieldsValid = isValidName(commonFields.name);

    const typeSpecificFieldsValid =
      typeSpecificFields.location != null &&
      typeSpecificFields.location.length > 0 &&
      typeSpecificFields.category != null &&
      typeSpecificFields.category.length > 0;

    return commonFieldsValid && typeSpecificFieldsValid;
  }, [commonFields, typeSpecificFields]);

  const handleTabChange = (value: $Enums.InventoryType) => {
    setSelectedTab(value);
    setTypeSpecificFields(getTypeSpecificFields(value));
  };

  const resetForm = useCallback(() => {
    setSelectedTab('SUPPLY');
    setCommonFields(getInitialCommonFields(session.data?.user.id || ''));
    setTypeSpecificFields(getTypeSpecificFields('SUPPLY'));
  }, [session.data?.user.id]);

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (!newOpen) {
        resetForm();
      }
      setOpen(newOpen);
    },
    [resetForm]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      handleOpenChange(false);
    } catch (error) {
      console.error('Failed to upload inventory:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | { name: string; value: string }
  ) => {
    const { name, value } = 'target' in e ? e.target : e;

    if (name === 'quantity') {
      const numValue = value === undefined ? undefined : Number(value);
      setCommonFields((prev) => ({
        ...prev,
        [name]: numValue,
      }));
      return;
    }

    if (name in commonFields) {
      setCommonFields((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setTypeSpecificFields((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageUpload = (url: string) => {
    setCommonFields((prev) => ({
      ...prev,
      imageUrl: url,
    }));
  };

  const handleImageRemove = () => {
    setCommonFields((prev) => ({
      ...prev,
      imageUrl: '',
    }));
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          className='bg-blue-500 hover:bg-blue-600 focus-visible:ring-0 focus-visible:outline-none'
          disabled={isLoading}
        >
          <Upload className='w-4 h-4 mr-2' />
          추가
        </Button>
      </DialogTrigger>
      <DialogContent className={`${dialogContentClassName} [&>button]:hidden`}>
        <DialogHeader className='flex-none'>
          <div className='flex items-center justify-between mb-4'>
            <DialogTitle>재고 추가</DialogTitle>
            <VisuallyHidden.Root>
              <DialogDescription>재고 추가 폼입니다.</DialogDescription>
            </VisuallyHidden.Root>
            <div className='flex gap-2'>
              <Button
                type='button'
                onClick={() => handleOpenChange(false)}
                disabled={isSubmitting}
                className='bg-red-400 hover:bg-red-500 focus-visible:ring-0 focus-visible:outline-none'
              >
                취소
              </Button>
              <Button
                type='submit'
                form='inventory-form'
                disabled={isSubmitting || !isFormValid}
                className='bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 focus-visible:ring-0 focus-visible:outline-none'
              >
                {isSubmitting ? '처리중...' : '저장'}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <form
          id='inventory-form'
          onSubmit={handleSubmit}
          className='space-y-4 overflow-y-auto max-h-[calc(85vh-120px)] scrollbar-hide px-4 pb-8'
        >
          <InventoryTab
            isLoading={isLoading}
            selectedTab={selectedTab}
            onTabChange={handleTabChange}
            showAllTab={false}
          />

          <div className='pb-2'>
            <div className='flex items-center gap-1 mb-2'>
              <Label>사진</Label>
              <span className='text-xs text-gray-500'>(비필수)</span>
            </div>
            <ImageUploader
              onImageUpload={handleImageUpload}
              onImageRemove={handleImageRemove}
              maxSizeMB={1}
              maxUploadSizeMB={5}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='name' className='flex items-center'>
              품명
              <RequiredIndicator />
            </Label>
            <Input
              id='name'
              name='name'
              required
              value={commonFields.name}
              onChange={handleChange}
              placeholder='품명을 입력하세요'
            />
          </div>

          <LocationSelect
            selectedTab={selectedTab}
            value={typeSpecificFields.location}
            onChange={handleChange}
            required
          />

          <CategorySelect
            selectedTab={selectedTab}
            value={typeSpecificFields.category}
            onChange={handleChange}
            required
          />

          <div className='mt-6 space-y-4'>
            <div className='text-sm text-gray-500 font-medium border-b pb-2'>
              선택사항
            </div>

            <div className='space-y-2'>
              <Label htmlFor='quantity'>수량</Label>
              <Input
                id='quantity'
                name='quantity'
                value={commonFields.quantity}
                onChange={handleChange}
                placeholder='수량을 입력하세요'
                type='number'
                min='0'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='memo'>메모</Label>
              <Input
                id='memo'
                name='memo'
                value={commonFields.memo}
                onChange={handleChange}
                placeholder='메모를 입력하세요'
              />
            </div>
          </div>

          {typeSpecificFields.type === 'SUPPLY' && (
            <SupplyFields fields={typeSpecificFields} onChange={handleChange} />
          )}
          {typeSpecificFields.type === 'FOOD' && (
            <FoodFields fields={typeSpecificFields} onChange={handleChange} />
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
