// /components/inventory/InventorySearch.tsx
'use client';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

type InventorySearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function InventorySearch({
  value,
  onChange,
}: InventorySearchProps) {
  return (
    <div className='relative flex-1'>
      <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors text-gray-500' />
      <Input
        className='pl-9'
        placeholder='재고 검색...'
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
