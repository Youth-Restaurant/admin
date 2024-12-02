'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ShoppingForm() {
  return (
    <div className='flex flex-col h-full'>
      <div className='space-y-4 flex-1 overflow-y-auto px-1 scrollbar-hide'>
        <div className='space-y-2'>
          <Label htmlFor='item'>구매 항목</Label>
          <Input id='item' placeholder='구매할 항목을 입력하세요' />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='quantity'>수량</Label>
          <Input
            id='quantity'
            type='number'
            min='1'
            placeholder='수량을 입력하세요'
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='store'>구매처</Label>
          <Input id='store' placeholder='구매처를 입력하세요' />
        </div>
      </div>

      <div className='mt-4 pt-4 border-t'>
        <Button className='w-full'>장보기 항목 추가</Button>
      </div>
    </div>
  );
}
