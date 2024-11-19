'use client';

import { useState, useEffect } from 'react';
import { InventoryType } from '@prisma/client';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { convertEnumToDisplay } from '@/types/inventory';

interface Location {
  id: number;
  name: string;
  type: InventoryType;
}

export default function CreateSubLocation() {
  const [subLocationName, setSubLocationName] = useState('');
  const [parentLocations, setParentLocations] = useState<Location[]>([]);
  const [parentLocation, setParentLocation] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<InventoryType>('SUPPLY');

  useEffect(() => {
    // 상위 로케이션 목록 가져오기
    const fetchLocations = async () => {
      const response = await fetch(`/api/locations`);
      const data = await response.json();
      setParentLocations(data);
      // 타입 변경 시 선택된 상위 위치 초기화
      setParentLocation(0);
    };

    fetchLocations();
  }, []);

  // 선택된 타입에 따른 상위 위치 필터링
  const filteredParentLocations = parentLocations.filter(
    (loc) => loc.type === selectedType
  );

  // 서브 로케이션 생성
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentLocation || !subLocationName) return;

    setLoading(true);
    try {
      const response = await fetch('/api/locations/sub', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parentId: parentLocation,
          name: subLocationName,
        }),
      });

      if (response.ok) {
        setSubLocationName('');
        setParentLocation(0);
        // 성공 메시지 또는 추가 작업
      }
    } catch (error) {
      console.error('서브 로케이션 생성 실패:', error);
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-4 p-4 bg-gray-50 rounded-lg'
    >
      <Tabs
        value={selectedType}
        onValueChange={(value) => {
          setSelectedType(value as InventoryType);
          setParentLocation(0); // 타입 변경 시 선택된 상위 위치 초기화
        }}
      >
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='SUPPLY'>
            {convertEnumToDisplay('type', 'SUPPLY')}
          </TabsTrigger>
          <TabsTrigger value='FOOD'>
            {convertEnumToDisplay('type', 'FOOD')}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div>
        <label className='block text-sm font-medium text-gray-700'>
          상위 위치 선택
          <select
            value={parentLocation}
            onChange={(e) => setParentLocation(Number(e.target.value))}
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
          >
            <option value={0}>선택해주세요</option>
            {filteredParentLocations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label className='block text-sm font-medium text-gray-700'>
          서브 위치 이름
          <input
            type='text'
            value={subLocationName}
            onChange={(e) => setSubLocationName(e.target.value)}
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
            placeholder='서브 위치 이름을 입력하세요'
          />
        </label>
      </div>
      <button
        type='submit'
        disabled={loading || !parentLocation || !subLocationName}
        className='w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400'
      >
        {loading ? '생성 중...' : '서브 위치 생성'}
      </button>
    </form>
  );
}
