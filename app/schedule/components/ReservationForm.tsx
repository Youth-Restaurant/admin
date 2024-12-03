// app/schedule/components/ReservationForm.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState, useEffect, useLayoutEffect } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Card } from '@/components/ui/card';
import { Users } from 'lucide-react';
import {
  DRINKS,
  HALL_1_TABLES,
  HALL_2_TABLES,
  MENU_OPTIONS,
} from '@/constants';
import { DrinkSelection } from './DrinkSelection';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';

const TABLE_OPTIONS = Array.from({ length: 15 }, (_, i) => i + 1);

// 인벤토리 타입 정의
interface Inventory {
  id: number;
  name: string;
  quantity: number | null;
  status: 'SUFFICIENT' | 'LOW';
}

interface ReservationFormProps {
  onClose: () => void;
  selectedDate: Date;
}

export function ReservationForm({
  onClose,
  selectedDate,
}: ReservationFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [selectedTables, setSelectedTables] = useState<number[]>([]);
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');
  const [hour, setHour] = useState('9');
  const [minute, setMinute] = useState('0');
  const [people, setPeople] = useState('2');
  const [selectedMenu, setSelectedMenu] = useState<string>('집밥');
  const [customerName, setCustomerName] = useState('');
  const [selectedDrinks, setSelectedDrinks] = useState<string[]>([]);
  const [drinkInventories, setDrinkInventories] = useState<
    Record<string, Inventory>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [description, setDescription] = useState('');

  const minuteOptions = Array.from({ length: 12 }, (_, i) => i * 5);

  useLayoutEffect(() => {
    if (period === 'AM') {
      setHour('9');
    } else {
      setHour('12');
    }
    setMinute('0');
  }, [period]);

  // 음료 재고 데이터 가져오기
  useEffect(() => {
    const fetchDrinkInventories = async () => {
      setIsLoading(true);
      try {
        const inventoryPromises = DRINKS.map((drink) =>
          fetch(`/api/inventory/name/${encodeURIComponent(drink)}`)
            .then((res) => res.json())
            .then((data) => ({ [drink]: data }))
        );

        const results = await Promise.all(inventoryPromises);
        const inventoryMap = Object.assign({}, ...results);
        setDrinkInventories(inventoryMap);
      } catch (error) {
        console.error('Failed to fetch drink inventories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDrinkInventories();
  }, []);

  const toggleTable = (tableNumber: number) => {
    const currentPeopleCount = Number(people);

    // 4명 이하인 경우
    if (currentPeopleCount <= 4) {
      // 이미 선택된 테이블을 클릭한 경우 선택 해제
      if (selectedTables.includes(tableNumber)) {
        setSelectedTables([]);
      } else {
        // 새로운 테이블 선택 시 기존 선택을 모두 해제하고 새로 선택
        setSelectedTables([tableNumber]);
      }
      return;
    }

    // 4명 초과인 경우 기존 로직 유지
    setSelectedTables((prev) =>
      prev.includes(tableNumber)
        ? prev.filter((t) => t !== tableNumber)
        : [...prev, tableNumber]
    );
  };

  const handlePeriodChange = (value: 'AM' | 'PM') => {
    if (value) {
      setPeriod(value);
    }
  };

  const handleHourChange = (hour: string) => {
    setHour(hour);
  };

  const handleMinuteChange = (minute: string) => {
    setMinute(minute);
  };

  const calculateTotalPrice = () => {
    if (!selectedMenu || !people) return 0;
    const menuItem = MENU_OPTIONS.find((item) => item.name === selectedMenu);
    return menuItem ? menuItem.price * Number(people) : 0;
  };

  const selectAllTables = () => {
    setSelectedTables(TABLE_OPTIONS);
  };

  const clearTableSelection = () => {
    setSelectedTables([]);
  };

  const isFormValid = () => {
    return (
      customerName.trim() !== '' &&
      selectedTables.length > 0 &&
      people !== '' &&
      Number(people) > 0 &&
      selectedMenu !== ''
    );
  };

  const selectHallTables = (hallTables: number[]) => {
    setSelectedTables((prev) => {
      const otherTables = prev.filter((t) => !hallTables.includes(t));
      return [...otherTables, ...hallTables];
    });
  };

  const clearHallTables = (hallTables: number[]) => {
    setSelectedTables((prev) => prev.filter((t) => !hallTables.includes(t)));
  };

  const toggleDrink = (drink: string) => {
    setSelectedDrinks((prev) =>
      prev.includes(drink) ? prev.filter((d) => d !== drink) : [...prev, drink]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    if (!session?.user?.id) {
      toast({
        title: '로그인이 필요합니다.',
        variant: 'destructive',
      });
      return;
    }

    // Combine selected date with time
    const combinedDateTime = new Date(selectedDate);
    combinedDateTime.setHours(parseInt(hour), parseInt(minute), 0, 0);

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName,
          reservationTime: combinedDateTime,
          numberOfPeople: Number(people),
          tableNumbers: selectedTables,
          drinks: selectedDrinks,
          description: description.trim() || undefined,
          userId: session.user.id,
        }),
      });

      if (!response.ok) {
        throw new Error('예약 생성에 실패했습니다.');
      }

      // 성공 시 처리 순서 변경
      router.refresh(); // 먼저 데이터 리프레시
      onClose(); // 모달 닫기
      toast({
        title: '예약이 성공적으로 생성되었습니다.',
      });
    } catch (error) {
      console.error('예약 생성 중 오류 발생:', error);
      toast({
        title: '예약 생성 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col h-full mb-1'>
      <div className='space-y-5 flex-1 overflow-y-auto scrollbar-hide p-1'>
        <div className='space-y-2'>
          <Label htmlFor='customerName' className='font-bold'>
            고객 명칭
          </Label>
          <Input
            id='customerName'
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder='고객 명칭을 입력하세요'
            className='w-auto'
          />
        </div>

        <div className='space-y-2'>
          <Label className='font-bold'>예약 시간</Label>
          <div className='flex items-center gap-2'>
            <ToggleGroup
              type='single'
              value={period}
              className='bg-background'
              onValueChange={handlePeriodChange}
            >
              <ToggleGroupItem
                value='AM'
                className='data-[state=off]:text-muted-foreground'
              >
                오전
              </ToggleGroupItem>
              <ToggleGroupItem
                value='PM'
                className='data-[state=off]:text-muted-foreground'
              >
                오후
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        <div className='flex items-center gap-2 ml-1'>
          <Select value={hour} onValueChange={handleHourChange}>
            <SelectTrigger className='w-24'>
              <SelectValue placeholder='시' />
            </SelectTrigger>
            <SelectContent>
              {period === 'PM'
                ? Array.from({ length: 11 }, (_, i) => i + 12).map((hour) => (
                    <SelectItem key={hour} value={hour.toString()}>
                      {hour === 12 ? '12' : `${hour - 12}`}
                    </SelectItem>
                  ))
                : Array.from({ length: 3 }, (_, i) => i + 9).map((hour) => (
                    <SelectItem key={hour} value={hour.toString()}>
                      {hour}
                    </SelectItem>
                  ))}
            </SelectContent>
          </Select>

          <span>시</span>

          <Select value={minute} onValueChange={handleMinuteChange}>
            <SelectTrigger className='w-24'>
              <SelectValue placeholder='분' />
            </SelectTrigger>
            <SelectContent>
              {minuteOptions.map((min) => (
                <SelectItem key={min} value={min.toString()}>
                  {min.toString().padStart(2, '0')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>분</span>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='people' className='font-bold'>
            인원수
          </Label>
          <Input
            id='people'
            type='number'
            min='1'
            value={people}
            onChange={(e) => setPeople(e.target.value)}
            placeholder='인원수를 입력하세요'
            className='w-[99%] ml-1'
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='menu' className='font-bold'>
            메뉴
          </Label>
          <Select value={selectedMenu} onValueChange={setSelectedMenu}>
            <SelectTrigger className='w-[99%] ml-1'>
              <SelectValue placeholder='메뉴를 선택하세요' />
            </SelectTrigger>
            <SelectContent>
              {MENU_OPTIONS.map((menu) => (
                <SelectItem key={menu.name} value={menu.name}>
                  {menu.name} ({menu.price.toLocaleString()}원)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedMenu && (
            <div className='text-sm text-green-600 mt-2 font-bold'>
              총 가격: {calculateTotalPrice().toLocaleString()}원
            </div>
          )}
        </div>

        <DrinkSelection
          drinks={DRINKS}
          selectedDrinks={selectedDrinks}
          drinkInventories={drinkInventories}
          isLoading={isLoading}
          onToggleDrink={toggleDrink}
        />

        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <Label className='font-bold'>테이블 선택</Label>
            <div className='space-x-2'>
              <Button
                variant='outline'
                size='sm'
                type='button'
                onClick={selectAllTables}
              >
                모두 선택
              </Button>
              <Button
                variant='outline'
                size='sm'
                type='button'
                onClick={clearTableSelection}
              >
                선택 취소
              </Button>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <div className='text-sm font-medium text-muted-foreground'>
                  홀 1
                </div>
                <div className='space-x-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    type='button'
                    onClick={() =>
                      selectHallTables(HALL_1_TABLES.map((t) => t.number))
                    }
                  >
                    모두 선택
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    type='button'
                    onClick={() =>
                      clearHallTables(HALL_1_TABLES.map((t) => t.number))
                    }
                  >
                    선택 취소
                  </Button>
                </div>
              </div>
              <Card className='p-2'>
                <div className='grid grid-cols-2 gap-2'>
                  {HALL_1_TABLES.slice(0, 4).map((table) => (
                    <Button
                      key={table.number}
                      type='button'
                      variant={
                        selectedTables.includes(table.number)
                          ? 'default'
                          : 'outline'
                      }
                      onClick={() => toggleTable(table.number)}
                      className={`h-13 flex flex-col items-center justify-center border ${
                        selectedTables.includes(table.number)
                          ? table.capacity === 6
                            ? 'bg-blue-600 hover:bg-blue-700 border-blue-600'
                            : 'bg-green-600 hover:bg-green-700 border-green-600'
                          : ''
                      }`}
                    >
                      <span>{table.number}번</span>
                      <span className='text-sm flex items-center gap-1'>
                        <Users className='h-3 w-3' />
                        {table.capacity}
                      </span>
                    </Button>
                  ))}
                </div>
                <div className='grid grid-cols-1 gap-2 mt-2'>
                  {HALL_1_TABLES.slice(4).map((table) => (
                    <Button
                      key={table.number}
                      type='button'
                      variant={
                        selectedTables.includes(table.number)
                          ? 'default'
                          : 'outline'
                      }
                      onClick={() => toggleTable(table.number)}
                      className={`h-13 flex flex-col items-center justify-center border ${
                        selectedTables.includes(table.number)
                          ? table.capacity === 6
                            ? 'bg-blue-600 hover:bg-blue-700 border-blue-600'
                            : 'bg-green-600 hover:bg-green-700 border-green-600'
                          : ''
                      }`}
                    >
                      <span>{table.number}번</span>
                      <span className='text-sm flex items-center gap-1'>
                        <Users className='h-3 w-3' />
                        {table.capacity}
                      </span>
                    </Button>
                  ))}
                </div>
              </Card>
            </div>

            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <div className='text-sm font-medium text-muted-foreground'>
                  홀 2
                </div>
                <div className='space-x-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    type='button'
                    onClick={() =>
                      selectHallTables(HALL_2_TABLES.map((t) => t.number))
                    }
                  >
                    모두 선택
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    type='button'
                    onClick={() =>
                      clearHallTables(HALL_2_TABLES.map((t) => t.number))
                    }
                  >
                    선택 취소
                  </Button>
                </div>
              </div>
              <Card className='grid grid-cols-2 gap-2 p-2'>
                <div className='grid'>
                  <div className='space-y-1'>
                    {[7, 8].map((number) => {
                      const table = HALL_2_TABLES.find(
                        (t) => t.number === number
                      );
                      if (!table) return null;
                      return (
                        <Button
                          key={table.number}
                          type='button'
                          variant={
                            selectedTables.includes(table.number)
                              ? 'default'
                              : 'outline'
                          }
                          onClick={() => toggleTable(table.number)}
                          className={`w-full h-13 flex flex-col items-center justify-center border ${
                            selectedTables.includes(table.number)
                              ? table.capacity === 6
                                ? 'bg-blue-600 hover:bg-blue-700 border-blue-600'
                                : 'bg-green-600 hover:bg-green-700 border-green-600'
                              : ''
                          }`}
                        >
                          <span>{table.number}번</span>
                          <span className='text-sm flex items-center gap-1'>
                            <Users className='h-3 w-3' />
                            {table.capacity}
                          </span>
                        </Button>
                      );
                    })}
                  </div>

                  <div className='pt-1'>
                    {[9].map((number) => {
                      const table = HALL_2_TABLES.find(
                        (t) => t.number === number
                      );
                      if (!table) return null;
                      return (
                        <Button
                          key={table.number}
                          type='button'
                          variant={
                            selectedTables.includes(table.number)
                              ? 'default'
                              : 'outline'
                          }
                          onClick={() => toggleTable(table.number)}
                          className={`w-full h-13 flex flex-col items-center justify-center border ${
                            selectedTables.includes(table.number)
                              ? table.capacity === 6
                                ? 'bg-blue-600 hover:bg-blue-700 border-blue-600'
                                : 'bg-green-600 hover:bg-green-700 border-green-600'
                              : ''
                          }`}
                        >
                          <span>{table.number}번</span>
                          <span className='text-sm flex items-center gap-1'>
                            <Users className='h-3 w-3' />
                            {table.capacity}
                          </span>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                <div className='grid grid-cols-1 gap-2'>
                  {[10, 11, 12, 13].map((number) => {
                    const table = HALL_2_TABLES.find(
                      (t) => t.number === number
                    );
                    if (!table) return null;
                    return (
                      <Button
                        key={table.number}
                        type='button'
                        variant={
                          selectedTables.includes(table.number)
                            ? 'default'
                            : 'outline'
                        }
                        onClick={() => toggleTable(table.number)}
                        className={`h-13 flex flex-col items-center justify-center border ${
                          selectedTables.includes(table.number)
                            ? table.capacity === 6
                              ? 'bg-blue-600 hover:bg-blue-700 border-blue-600'
                              : 'bg-green-600 hover:bg-green-700 border-green-600'
                            : ''
                        }`}
                      >
                        <span>{table.number}번</span>
                        <span className='text-sm flex items-center gap-1'>
                          <Users className='h-3 w-3' />
                          {table.capacity}
                        </span>
                      </Button>
                    );
                  })}
                </div>
              </Card>
            </div>
          </div>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='description' className='font-bold'>
            특이 사항{' '}
            <span className='text-muted-foreground text-sm'>(선택)</span>
          </Label>
          <Textarea
            id='description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='특이 사항을 입력하세요'
            className='w-[99%] ml-1'
            rows={5}
          />
        </div>
      </div>

      <div className='mt-4 pt-4 border-t'>
        <Button type='submit' className='w-full' disabled={!isFormValid()}>
          예약 추가
        </Button>
      </div>
    </form>
  );
}
