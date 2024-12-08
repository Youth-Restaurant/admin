import { Input } from '@/components/ui/input';
import { SectionProps } from './types';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface CustomerSectionProps extends SectionProps {
  value: string;
  onChange: (value: string) => void;
  inputClassName?: string;
  containerClassName?: string;
  viewMode?: 'default' | 'large' | 'view';
}

export function CustomerSection({
  value,
  onChange,
  inputClassName = 'w-auto',
  containerClassName = 'space-y-2',
  viewMode = 'default',
}: CustomerSectionProps) {
  if (viewMode === 'view') {
    return (
      <div className={containerClassName}>
        <Label className='font-bold'>고객 명칭</Label>
        <div className='text-lg'>{value}</div>
      </div>
    );
  }

  const isLarge = viewMode === 'large';

  return (
    <div className={containerClassName}>
      <Label
        htmlFor='customerName'
        className={cn('font-bold', isLarge && 'text-3xl')}
      >
        고객 명칭
      </Label>
      <Input
        id='customerName'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder='고객 명칭을 입력하세요'
        className={cn(inputClassName, isLarge && 'text-2xl p-6 h-auto')}
      />
    </div>
  );
}
