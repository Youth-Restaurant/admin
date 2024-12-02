// app/schedule/page.tsx

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ReservationForm } from './components/ReservationForm';
import { ShoppingForm } from './components/ShoppingForm';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { LargeReservationForm } from './components/LargeReservationForm';

interface SelectedDate {
  day: number;
  month: number;
  year: number;
  dayOfWeek: string;
}

type ModalType = 'reservation' | 'shopping' | null;

const VIEW_MODE_STORAGE_KEY = 'scheduleViewMode';

export default function Page() {
  const [date, setDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<SelectedDate | null>(() => {
    const today = new Date();
    return {
      day: today.getDate(),
      month: today.getMonth() + 1,
      year: today.getFullYear(),
      dayOfWeek: ['일', '월', '화', '수', '목', '금', '토'][today.getDay()],
    };
  });
  const [viewMode, setViewMode] = useState<'default' | 'large'>(() => {
    if (typeof window === 'undefined') return 'default';
    return (
      (localStorage.getItem(VIEW_MODE_STORAGE_KEY) as 'default' | 'large') ||
      'default'
    );
  });
  const [modalType, setModalType] = useState<ModalType>(null);

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

  const handleDateClick = (day: number) => {
    const selectedDay = new Date(year, month, day);
    const dayOfWeek = daysInWeek[selectedDay.getDay()];

    setSelectedDate({
      day,
      month: month + 1,
      year,
      dayOfWeek,
    });
  };

  const handleModalOpen = (type: ModalType) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleViewModeChange = (value: 'default' | 'large') => {
    setViewMode(value);
    localStorage.setItem(VIEW_MODE_STORAGE_KEY, value);
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

      const isSelected =
        selectedDate?.day === day &&
        selectedDate?.month === month + 1 &&
        selectedDate?.year === year;

      days.push(
        <div
          key={`${year}-${month}-${day}`}
          className={cn(
            'p-3 text-center transition-colors hover:bg-muted rounded-md cursor-pointer',
            isSelected && 'bg-blue-500 text-white hover:bg-blue-600',
            isToday && 'border border-blue-500 font-bold'
          )}
          onClick={() => handleDateClick(day)}
        >
          {isToday ? '오늘' : day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className='h-[calc(100vh-4rem)] pt-3'>
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

          {selectedDate && (
            <div className='mt-6 space-y-4 border-t pt-4'>
              <p className='text-lg font-medium text-center'>
                {selectedDate.year}년 {selectedDate.month}월 {selectedDate.day}
                일 ({selectedDate.dayOfWeek})
              </p>
              <div className='grid grid-cols-2 gap-2'>
                <Button
                  size='lg'
                  className='w-full text-lg py-6 bg-blue-500 hover:bg-blue-600'
                  onClick={() => handleModalOpen('reservation')}
                >
                  예약하기
                </Button>
                <Button
                  size='lg'
                  className='w-full text-lg py-6 bg-green-500 hover:bg-green-600'
                  onClick={() => handleModalOpen('shopping')}
                >
                  장보기
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          className={cn(
            'max-h-[90vh] overflow-y-auto scrollbar-hide',
            modalType === 'reservation' &&
              viewMode === 'default' &&
              'max-h-[80vh]'
          )}
        >
          <DialogHeader>
            <DialogTitle className='flex flex-col gap-2'>
              <div className='flex gap-2'>
                {selectedDate &&
                  `${selectedDate.year}년 ${selectedDate.month}월 ${selectedDate.day}일 (${selectedDate.dayOfWeek})`}
              </div>
              {modalType === 'reservation' && (
                <div className='flex items-center gap-2 text-sm font-normal'>
                  <ToggleGroup
                    type='single'
                    defaultValue={viewMode}
                    onValueChange={(value) =>
                      handleViewModeChange(value as 'default' | 'large')
                    }
                  >
                    <ToggleGroupItem value='default'>기본</ToggleGroupItem>
                    <ToggleGroupItem value='large'>크게 보기</ToggleGroupItem>
                  </ToggleGroup>
                </div>
              )}
            </DialogTitle>
          </DialogHeader>
          <div>
            {modalType === 'reservation' ? (
              viewMode === 'large' ? (
                <LargeReservationForm />
              ) : (
                <ReservationForm />
              )
            ) : (
              <ShoppingForm />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
