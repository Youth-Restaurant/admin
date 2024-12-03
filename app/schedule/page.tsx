// app/schedule/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
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
import { format } from 'date-fns';
import { RestaurantTable } from '@prisma/client';

type ModalType = 'reservation' | 'shopping' | 'reservationDetail' | null;

const VIEW_MODE_STORAGE_KEY = 'scheduleViewMode';

interface ReservationWithCreatedBy {
  id: number;
  guest: {
    name: string;
  };
  reservationDate: string;
  numberOfGuests: number;
  tables: {
    table: {
      tableNumber: number;
    };
  }[];
  createdById: string;
  createdBy: string;
}

export default function Page() {
  const [date, setDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [viewMode, setViewMode] = useState<'default' | 'large'>(() => {
    if (typeof window === 'undefined') return 'default';
    return (
      (localStorage.getItem(VIEW_MODE_STORAGE_KEY) as 'default' | 'large') ||
      'default'
    );
  });
  const [modalType, setModalType] = useState<ModalType>(null);
  const [reservations, setReservations] = useState<ReservationWithCreatedBy[]>(
    []
  );
  const [selectedReservation, setSelectedReservation] =
    useState<ReservationWithCreatedBy | null>(null);
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [isLoadingReservations, setIsLoadingReservations] = useState(false);

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
    const today = new Date();
    const selectedDay = new Date(year, month, day);

    if (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    ) {
      setSelectedDate(today);
    } else {
      setSelectedDate(selectedDay);
    }
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
        selectedDate?.getDate() === day &&
        selectedDate?.getMonth() === month &&
        selectedDate?.getFullYear() === year;

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

  useEffect(() => {
    const fetchReservations = async () => {
      if (!selectedDate) return;

      setIsLoadingReservations(true);
      try {
        const response = await fetch(
          `/api/reservations?date=${format(selectedDate, 'yyyy-MM-dd')}`
        );
        if (!response.ok) throw new Error('Failed to fetch reservations');
        const reservationsData = await response.json();

        const fetchUserName = async (userId: string) => {
          const userResponse = await fetch(`/api/user?id=${userId}`);
          if (!userResponse.ok) throw new Error('Failed to fetch user');
          const userData = await userResponse.json();
          return userData.nickname;
        };

        const reservationsWithUserNames = await Promise.all(
          reservationsData.map(
            async (
              reservation: Omit<ReservationWithCreatedBy, 'createdBy'>
            ) => {
              const userName = await fetchUserName(reservation.createdById);
              return { ...reservation, createdBy: userName };
            }
          )
        );

        setReservations(reservationsWithUserNames);
      } catch (error) {
        console.error('Failed to fetch reservations:', error);
      } finally {
        setIsLoadingReservations(false);
      }
    };

    fetchReservations();
  }, [selectedDate]);

  const handleReservationClick = async (
    reservation: ReservationWithCreatedBy
  ) => {
    try {
      const response = await fetch('/api/tables');
      if (!response.ok) throw new Error('Failed to fetch tables');
      const data = await response.json();
      console.log('tables', data);
      setTables(data);
      setSelectedReservation(reservation);
      setModalType('reservationDetail');
      setIsModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch tables:', error);
    }
  };

  const renderTable = (table: RestaurantTable) => {
    const isSelected = selectedReservation?.tables.some(
      (t) => t.table.tableNumber === table.tableNumber
    );
    return (
      <div
        key={table.id}
        className={cn(
          'aspect-square flex flex-col items-center justify-center rounded-md border text-sm',
          isSelected && 'bg-green-100 text-green-800 border-green-200',
          !isSelected && 'text-muted-foreground border-muted'
        )}
      >
        <span className='font-medium'>{table.tableNumber}번</span>
        <span className='text-xs'>{table.capacity}인석</span>
      </div>
    );
  };

  const renderReservationsList = () => {
    if (isLoadingReservations) {
      return (
        <div className='flex items-center justify-center py-8'>
          <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
        </div>
      );
    }

    if (reservations.length === 0) {
      return (
        <div className='text-center py-8 text-muted-foreground'>
          예약이 없습니다.
        </div>
      );
    }

    return (
      <div className='space-y-2'>
        {reservations.map((reservation) => (
          <div
            key={reservation.id}
            className='p-4 bg-muted rounded-lg flex items-center justify-between cursor-pointer hover:bg-muted/80 transition-colors'
            onClick={() => handleReservationClick(reservation)}
          >
            <div>
              <p className='font-medium text-lg'>{reservation.guest.name}</p>
              <p className='text-sm text-muted-foreground'>
                등록자: {reservation.createdBy}
              </p>
              <p className='text-base text-muted-foreground'>
                {(() => {
                  const time = new Date(reservation.reservationDate);
                  const hours = time.getHours();
                  const minutes = time.getMinutes();
                  const ampm = hours >= 12 ? '오후' : '오전';
                  const displayHours = hours % 12 || 12;
                  return `${ampm} ${displayHours}:${minutes
                    .toString()
                    .padStart(2, '0')}`;
                })()}{' '}
                | {reservation.numberOfGuests}명 | 테이블{' '}
                {reservation.tables.map((t) => t.table.tableNumber).join(', ')}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
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
                {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월{' '}
                {selectedDate.getDate()}일 (
                {
                  ['일', '월', '화', '수', '목', '금', '토'][
                    selectedDate.getDay()
                  ]
                }
                )
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

              <div className='space-y-2 mb-4'>
                <h3 className='font-medium text-xl'>예약 목록</h3>
                {renderReservationsList()}
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
                  `${selectedDate.getFullYear()}년 ${
                    selectedDate.getMonth() + 1
                  }월 ${selectedDate.getDate()}일 (${
                    ['일', '월', '화', '수', '목', '금', '토'][
                      selectedDate.getDay()
                    ]
                  })`}
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
                <ReservationForm
                  onClose={() => setIsModalOpen(false)}
                  selectedDate={selectedDate}
                />
              )
            ) : modalType === 'shopping' ? (
              <ShoppingForm />
            ) : modalType === 'reservationDetail' && selectedReservation ? (
              <div className='space-y-4'>
                <div className='grid gap-2'>
                  <h3 className='font-semibold text-lg'>예약 상세정보</h3>
                  <div className='border rounded-lg overflow-hidden'>
                    <table className='w-full'>
                      <tbody>
                        <tr className='border-b'>
                          <td className='font-medium bg-muted px-4 py-2 w-24'>
                            예약자
                          </td>
                          <td className='px-4 py-2'>
                            {selectedReservation.guest.name}
                          </td>
                        </tr>
                        <tr className='border-b'>
                          <td className='font-medium bg-muted px-4 py-2'>
                            등록자
                          </td>
                          <td className='px-4 py-2'>
                            {selectedReservation.createdBy}
                          </td>
                        </tr>
                        <tr className='border-b'>
                          <td className='font-medium bg-muted px-4 py-2'>
                            예약 시간
                          </td>
                          <td className='px-4 py-2'>
                            {(() => {
                              const time = new Date(
                                selectedReservation.reservationDate
                              );
                              const hours = time.getHours();
                              const minutes = time.getMinutes();
                              const ampm = hours >= 12 ? '오후' : '오전';
                              const displayHours = hours % 12 || 12;
                              return `${ampm} ${displayHours}:${minutes
                                .toString()
                                .padStart(2, '0')}`;
                            })()}
                          </td>
                        </tr>
                        <tr>
                          <td className='font-medium bg-muted px-4 py-2'>
                            인원
                          </td>
                          <td className='px-4 py-2'>
                            {selectedReservation.numberOfGuests}명
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className='mt-4'>
                    <p className='font-medium mb-2'>테이블 배치도:</p>
                    <div className='space-y-4'>
                      <div>
                        <p className='font-medium'>홀 1</p>
                        <div className='grid grid-cols-5 gap-2'>
                          <div className='col-start-1'>
                            {tables
                              .filter(
                                (table) =>
                                  table.location === '홀1' &&
                                  table.tableNumber === 1
                              )
                              .map((table) => {
                                const isSelected =
                                  selectedReservation.tables.some(
                                    (t) =>
                                      t.table.tableNumber === table.tableNumber
                                  );
                                return (
                                  <div
                                    key={table.id}
                                    className={cn(
                                      'aspect-square flex flex-col items-center justify-center rounded-md border text-sm',
                                      isSelected &&
                                        'bg-green-100 text-green-800 border-green-200',
                                      !isSelected &&
                                        'text-muted-foreground border-muted'
                                    )}
                                  >
                                    <span className='font-medium'>
                                      {table.tableNumber}번
                                    </span>
                                    <span className='text-xs'>
                                      {table.capacity}인석
                                    </span>
                                  </div>
                                );
                              })}
                          </div>
                          <div>
                            {tables
                              .filter(
                                (table) =>
                                  table.location === '홀1' &&
                                  table.tableNumber === 2
                              )
                              .map((table) => renderTable(table))}
                          </div>
                          <div className='col-span-2' />

                          {/* 3,4번 테이블 */}
                          <div className='col-start-1'>
                            {tables
                              .filter(
                                (table) =>
                                  table.location === '홀1' &&
                                  table.tableNumber === 3
                              )
                              .map((table) => renderTable(table))}
                          </div>
                          <div>
                            {tables
                              .filter(
                                (table) =>
                                  table.location === '홀1' &&
                                  table.tableNumber === 4
                              )
                              .map((table) => renderTable(table))}
                          </div>
                          <div className='col-span-2' />

                          {/* 5번 테이블 */}
                          <div className='col-start-1 col-span-2'>
                            {tables
                              .filter(
                                (table) =>
                                  table.location === '홀1' &&
                                  table.tableNumber === 5
                              )
                              .map((table) => renderTable(table))}
                          </div>
                          <div className='col-span-2' />

                          {/* 6번 테이블 */}
                          <div className='col-start-1 col-span-2'>
                            {tables
                              .filter(
                                (table) =>
                                  table.location === '홀1' &&
                                  table.tableNumber === 6
                              )
                              .map((table) => renderTable(table))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className='font-medium'>홀 2</p>
                        <div className='grid grid-cols-5 gap-2'>
                          {tables
                            .filter((table) => table.location === '홀2')
                            .map((table) => renderTable(table))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='flex justify-end'>
                  <Button
                    variant='outline'
                    onClick={() => {
                      setIsModalOpen(false);
                      setSelectedReservation(null);
                    }}
                  >
                    닫기
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
