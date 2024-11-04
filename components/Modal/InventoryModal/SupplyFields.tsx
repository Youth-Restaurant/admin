// /components/modal/InventoryModal/SupplyFields.tsx
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { UploadSupplyItem } from '@/types/inventory';

type SupplyFieldsProps = {
  fields: Omit<
    UploadSupplyItem,
    'name' | 'quantity' | 'status' | 'createdBy' | 'updatedBy'
  >;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function SupplyFields({ fields, onChange }: SupplyFieldsProps) {
  return (
    <>
      <div className='space-y-2'>
        <Label htmlFor='manufacturer'>제조사</Label>
        <Input
          id='manufacturer'
          name='manufacturer'
          value={fields.manufacturer}
          onChange={onChange}
          placeholder='제조사를 입력하세요'
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='modelNumber'>모델번호</Label>
        <Input
          id='modelNumber'
          name='modelNumber'
          value={fields.modelNumber}
          onChange={onChange}
          placeholder='모델번호를 입력하세요'
        />
      </div>
    </>
  );
}
