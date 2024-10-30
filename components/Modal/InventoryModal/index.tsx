'use client';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import {
  UploadSupplyItem,
  UploadFoodItem,
  SupplyLocationType,
  FoodLocationType,
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

type InventoryUploadModalProps = {
  isLoading?: boolean;
  onSubmit: (data: UploadSupplyItem | UploadFoodItem) => Promise<void>;
  updatedBy: string;
};

type CommonFields = Pick<
  InventoryItem,
  | 'name'
  | 'quantity'
  | 'status'
  | 'updatedBy'
  | 'memo'
  | 'minimumQuantity'
  | 'imageUrl'
>;

type FormState = {
  supplies: UploadSupplyItem;
  food: UploadFoodItem;
};

const getCommonFields = (updatedBy: string): CommonFields => ({
  name: '',
  quantity: 0,
  status: '충분' as const,
  updatedBy,
  memo: '',
  minimumQuantity: 0,
  imageUrl: '',
});

const getTypeSpecificFields = (type: InventoryType) => {
  if (type === 'supplies') {
    return {
      type: 'supplies' as const,
      location: '' as SupplyLocationType,
      category: '' as SupplyCategoryType,
      manufacturer: '',
      modelNumber: '',
    };
  } else {
    return {
      type: 'food' as const,
      location: '' as FoodLocationType,
      category: '' as FoodCategoryType,
      expirationDate: '',
    };
  }
};

const dialogContentClassName =
  'w-[min(calc(100vw-40px),460px)] max-h-[85vh] overflow-y-auto hide-scrollbar';

export default function InventoryUploadModal({
  isLoading = false,
  onSubmit,
  updatedBy,
}: InventoryUploadModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'supplies' | 'food'>(
    'supplies'
  );
  const [commonFields, setCommonFields] = useState<CommonFields>(
    getCommonFields(updatedBy)
  );
  const [typeSpecificFields, setTypeSpecificFields] = useState(
    getTypeSpecificFields(selectedTab)
  );

  const formData = {
    ...commonFields,
    ...typeSpecificFields,
  } as FormState[typeof selectedTab];

  const handleTabChange = (value: string) => {
    const inventoryType = value as InventoryType;
    setSelectedTab(inventoryType);
    setTypeSpecificFields(getTypeSpecificFields(inventoryType));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      setOpen(false);
      setCommonFields(getCommonFields(updatedBy));
      setTypeSpecificFields(getTypeSpecificFields(selectedTab));
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='bg-blue-500 hover:bg-blue-600' disabled={isLoading}>
          <Upload className='w-4 h-4 mr-2' />
          추가
        </Button>
      </DialogTrigger>
      <DialogContent className={dialogContentClassName}>
        <DialogHeader>
          <DialogTitle>재고 추가</DialogTitle>
        </DialogHeader>

        <InventoryTab
          isLoading={isLoading}
          selectedTab={selectedTab}
          onTabChange={handleTabChange}
        />

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='pb-2'>
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

          <div className='space-y-2'>
            <Label htmlFor='quantity' className='flex items-center'>
              수량
              <RequiredIndicator />
            </Label>
            <Input
              id='quantity'
              name='quantity'
              required
              value={commonFields.quantity}
              onChange={handleChange}
              placeholder='수량을 입력하세요'
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

          <div className='space-y-2'>
            <Label htmlFor='minimumQuantity'>최소 보유량</Label>
            <Input
              id='minimumQuantity'
              name='minimumQuantity'
              value={commonFields.minimumQuantity}
              onChange={handleChange}
              placeholder='최소 보유량을 입력하세요'
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

          {typeSpecificFields.type === 'supplies' && (
            <SupplyFields fields={typeSpecificFields} onChange={handleChange} />
          )}
          {typeSpecificFields.type === 'food' && (
            <FoodFields fields={typeSpecificFields} onChange={handleChange} />
          )}

          <div className='flex justify-end gap-2 pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              type='submit'
              disabled={isSubmitting}
              className='bg-blue-500 hover:bg-blue-600'
            >
              {isSubmitting ? '처리중...' : '저장'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
