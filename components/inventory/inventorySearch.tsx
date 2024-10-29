// /components/inventory/InventorySearch.tsx
'use client';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

type InventorySearchProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export default function InventorySearch({
  value,
  onChange,
  disabled = false,
}: InventorySearchProps) {
  return (
    <div className='relative flex-1'>
      <Search
        className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${
          disabled ? 'text-gray-300' : 'text-gray-400'
        }`}
      />
      <Input
        className='pl-9'
        placeholder='재고 검색...'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    </div>
  );
}
