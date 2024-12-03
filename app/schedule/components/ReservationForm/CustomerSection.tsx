import { Input } from '@/components/ui/input';
import { SectionProps } from './types';
import { Label } from '@/components/ui/label';

interface CustomerSectionProps extends SectionProps {
  value: string;
  onChange: (value: string) => void;
}

export function CustomerSection({ value, onChange }: CustomerSectionProps) {
  return (
    <div className='space-y-2'>
      <Label htmlFor='customerName' className='font-bold'>
        고객 명칭
      </Label>
      <Input
        id='customerName'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder='고객 명칭을 입력하세요'
        className='w-auto'
      />
    </div>
  );
}
