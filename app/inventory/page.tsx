'use client';
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Upload } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SUPPLIES_ITEMS, FOOD_ITEMS } from '@/mocks/inventory';
import { matchKoreanText } from '@/utils/search';
import { LOCATIONS } from '@/types/inventory';

export default function InventoryPage() {
  const [selectedTab, setSelectedTab] = useState<'supplies' | 'food'>(
    'supplies'
  );
  const [selectedLocation, setSelectedLocation] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState('');

  const handleTabChange = (tab: 'supplies' | 'food') => {
    setSelectedTab(tab);
    setSelectedLocation('전체');
  };

  // 현재 탭에 따라 아이템 리스트 선택
  const currentItems = selectedTab === 'supplies' ? SUPPLIES_ITEMS : FOOD_ITEMS;

  // 위치 필터링 적용
  const filteredItems = currentItems.filter(
    (item) => selectedLocation === '전체' || item.location === selectedLocation
  );

  // 한글 검색 적용
  const searchedItems = filteredItems.filter(
    (item) =>
      matchKoreanText(item.name, searchQuery) ||
      matchKoreanText(item.category, searchQuery)
  );

  return (
    <div className='flex flex-col h-full'>
      <div className='sticky top-0 bg-white p-4 z-10 border-b'>
        <div className='flex gap-2 mb-4'>
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
            <Input
              className='pl-9'
              placeholder='재고 검색...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className='bg-blue-500 hover:bg-blue-600'>
            <Upload className='w-4 h-4 mr-2' />
            추가
          </Button>
        </div>

        <Tabs
          defaultValue='supplies'
          className='mb-4'
          onValueChange={(value) =>
            handleTabChange(value as 'supplies' | 'food')
          }
        >
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='supplies'>물품</TabsTrigger>
            <TabsTrigger value='food'>식재료</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className='flex gap-2 overflow-x-auto hide-scrollbar'>
          <Badge
            variant={selectedLocation === '전체' ? 'default' : 'outline'}
            className='cursor-pointer'
            onClick={() => setSelectedLocation('전체')}
          >
            전체
          </Badge>
          {LOCATIONS[selectedTab].map((location) => (
            <Badge
              key={location}
              variant={selectedLocation === location ? 'default' : 'outline'}
              className='cursor-pointer'
              onClick={() => setSelectedLocation(location)}
            >
              {location}
            </Badge>
          ))}
        </div>
      </div>

      <div className='flex-1 overflow-y-auto p-4'>
        <div className='space-y-3'>
          {searchedItems.map((item) => (
            <Card key={item.id} className='shadow-none'>
              <CardContent className='p-4'>
                <div className='flex justify-between items-start'>
                  <div>
                    <div className='flex items-center gap-2 mb-1'>
                      <h3 className='font-semibold text-lg'>{item.name}</h3>
                      <Badge
                        variant={item.status === '충분' ? 'blue' : 'purple'}
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <div className='text-sm text-gray-500 space-y-1'>
                      <p>위치: {item.location}</p>
                      <p>수량: {item.quantity}</p>
                      <p className='text-xs'>
                        최종 수정: {item.lastUpdated} by {item.updatedBy}
                      </p>
                    </div>
                  </div>
                  <Badge variant='outline'>{item.category}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
