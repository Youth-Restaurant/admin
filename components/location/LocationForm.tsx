'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { convertEnumToDisplay } from '@/types/inventory';
import { useToast } from '@/hooks/use-toast';

type LocationFormProps = {
  type: 'SUPPLY' | 'FOOD';
  title: string;
};

function LocationFormContent({ type, title }: LocationFormProps) {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const hasWhitespace = name.startsWith(' ') || name.endsWith(' ');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    const hasSpecialChar = /[^A-Za-z0-9ㄱ-ㅎㅏ-ㅣ가-힣\s]/.test(newValue);

    if (hasSpecialChar) {
      toast({
        variant: 'destructive',
        title: '입력 제한',
        description: '한글, 영문, 숫자만 입력 가능합니다',
      });
      return;
    }

    if (
      name.endsWith(' ') &&
      newValue.length > name.length &&
      (e.nativeEvent as InputEvent).data === ' '
    ) {
      return;
    }

    setName(newValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const trimmedName = name.trim();
      const uppercaseName = trimmedName.replace(/[a-z]/g, (match) =>
        match.toUpperCase()
      );

      if (trimmedName !== uppercaseName) {
        toast({
          title: '알림',
          description: '영어 소문자가 대문자로 변환되어 등록됩니다',
        });
      }

      const response = await fetch('/api/locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: uppercaseName, type }),
      });

      if (!response.ok) throw new Error('위치 등록에 실패했습니다');

      toast({
        title: '위치 등록 성공',
        description: '새로운 위치가 등록되었습니다',
      });

      setName('');
    } catch (error: any) {
      console.log('error', error);
      toast({
        variant: 'destructive',
        title: '위치 등록 실패',
        description: '이미 등록된 위치입니다',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const previewName = name
    .trim()
    .replace(/[a-z]/g, (match) => match.toUpperCase());
  const hasLowerCase = /[a-z]/.test(name);

  return (
    <div className='p-4 bg-white rounded-lg shadow'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <h3 className='text-lg font-medium'>{title}</h3>
        <div className='flex gap-4'>
          <div className='flex-1'>
            <Input
              required
              value={name}
              onChange={handleNameChange}
              placeholder='위치 이름 (한글, 영문, 숫자만 입력 가능)'
              className={hasWhitespace ? 'border-red-500' : ''}
            />
            {hasWhitespace && (
              <p className='text-red-500 text-sm mt-1'>
                앞뒤 공백을 제거해주세요
              </p>
            )}
            {hasLowerCase && (
              <p className='text-blue-500 text-sm mt-1'>
                등록 시: {previewName}
              </p>
            )}
          </div>
          <Button
            type='submit'
            disabled={
              isLoading ||
              !name.trim() ||
              hasWhitespace ||
              /[ㄱ-ㅇㅏ-ㅣ]/.test(name)
            }
          >
            {isLoading ? '등록 중...' : '등록'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function LocationForm() {
  return (
    <div className='space-y-4'>
      <h2 className='text-xl font-semibold'>새로운 위치 등록</h2>
      <div className='grid gap-4 md:grid-cols-2'>
        <LocationFormContent
          type='SUPPLY'
          title={`${convertEnumToDisplay('type', 'SUPPLY')} 위치 등록`}
        />
        <LocationFormContent
          type='FOOD'
          title={`${convertEnumToDisplay('type', 'FOOD')} 위치 등록`}
        />
      </div>
    </div>
  );
}
