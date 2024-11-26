// app/schedule/page.tsx

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Page() {
  const [date, setDate] = useState(new Date());

  const daysInWeek = ['일', '월', '화', '수', '목', '금', '토'];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);

  const prevMonth = () => {
    setDate(new Date(year, month - 1));
  };

  const nextMonth = () => {
    setDate(new Date(year, month + 1));
  };

  const renderCalendar = () => {
    const days = [];

    // 이전 달의 마지막 날짜들
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className='p-3 text-muted-foreground' />
      );
    }

    // 현재 달의 날짜들
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        new Date().getDate() === day &&
        new Date().getMonth() === month &&
        new Date().getFullYear() === year;

      days.push(
        <div
          key={`${year}-${month}-${day}`}
          className={cn(
            'p-3 text-center transition-colors hover:bg-muted rounded-md cursor-pointer',
            isToday
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'hover:bg-muted'
          )}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className='h-[calc(50vh-4rem)] pt-3'>
      <Card className='max-w-3xl mx-auto'>
        <CardHeader className='space-y-2'>
          <div className='flex items-center justify-between'>
            <Button variant='outline' size='icon' onClick={prevMonth}>
              <ChevronLeft className='h-4 w-4' />
            </Button>
            <h2 className='text-xl font-semibold'>
              {year}년 {month + 1}월
            </h2>
            <Button variant='outline' size='icon' onClick={nextMonth}>
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>
          <div className='grid grid-cols-7 gap-1'>
            {daysInWeek.map((day) => (
              <div
                key={day}
                className='text-center font-medium text-muted-foreground p-2'
              >
                {day}
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-7 gap-1'>{renderCalendar()}</div>
        </CardContent>
      </Card>
    </div>
  );
}
