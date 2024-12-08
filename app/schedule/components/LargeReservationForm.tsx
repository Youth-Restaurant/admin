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
import { useState, useEffect } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Card } from '@/components/ui/card';

import StepIndicator from './StepIndicator';
import { Users } from 'lucide-react';
import { DRINKS, MENU_OPTIONS } from '@/constants';
import { fetchDrinkInventories, type Inventory } from '@/lib/utils/inventory';
import { DrinkSelection } from './DrinkSelection';
import { CustomerSection } from './ReservationForm/CustomerSection';
import { useReservationForm } from '@/hooks/useReservationForm';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from '@/hooks/use-toast';
import {
  handleReservationSubmit,
  type ReservationData,
} from './ReservationForm/index';

const HALL_1_TABLES = [
  { number: 1, capacity: 4 },
  { number: 2, capacity: 4 },
  { number: 3, capacity: 4 },
  { number: 4, capacity: 4 },
  { number: 5, capacity: 6 },
  { number: 6, capacity: 6 },
];

const HALL_2_TABLES = [
  { number: 7, capacity: 6 },
  { number: 8, capacity: 6 },
  { number: 9, capacity: 6 },
  { number: 10, capacity: 4 },
  { number: 11, capacity: 4 },
  { number: 12, capacity: 4 },
  { number: 13, capacity: 4 },
  { number: 14, capacity: 6 },
  { number: 15, capacity: 6 },
];

export function LargeReservationForm({
  selectedDate,
  onClose,
}: {
  selectedDate: Date;
  onClose: () => void;
}) {
  const form = useReservationForm({ selectedDate, onClose });
  const router = useRouter();
  const { data: session } = useSession();

  const [drinkInventories, setDrinkInventories] = useState<
    Record<string, Inventory>
  >({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDrinkInventories = async () => {
      setIsLoading(true);
      const inventories = await fetchDrinkInventories(DRINKS);
      setDrinkInventories(inventories);
      setIsLoading(false);
    };

    loadDrinkInventories();
  }, []);

  const minuteOptions = Array.from({ length: 12 }, (_, i) => i * 5);

  const toggleDrink = (drink: string) => {
    form.setSelectedDrinks((prev) =>
      prev.includes(drink) ? prev.filter((d) => d !== drink) : [...prev, drink]
    );
  };

  const calculateTotalCapacity = () => {
    return [...HALL_1_TABLES, ...HALL_2_TABLES].reduce(
      (sum, table) => sum + table.capacity,
      0
    );
  };

  const calculateHallCapacity = (tables: typeof HALL_1_TABLES) => {
    return tables.reduce((sum, table) => sum + table.capacity, 0);
  };

  const handleSubmit = async () => {
    if (!session?.user?.id) {
      toast({
        title: '로그인이 필요합니다.',
        variant: 'destructive',
      });
      return;
    }

    const combinedDateTime = new Date(selectedDate);
    combinedDateTime.setHours(parseInt(form.hour), parseInt(form.minute), 0, 0);

    const reservationData: ReservationData = {
      customerName: form.customerName,
      reservationTime: combinedDateTime,
      numberOfPeople: Number(form.people),
      tableNumbers: form.selectedTables,
      drinks: form.selectedDrinks,
      description: form.specialRequests.trim() || undefined,
      userId: session.user.id,
    };

    const success = await handleReservationSubmit(reservationData);
    if (success) {
      router.refresh();
      onClose();
    }
  };

  const renderStep = () => {
    switch (form.step) {
      case 1:
        return (
          <CustomerSection
            value={form.customerName}
            onChange={form.setCustomerName}
            inputClassName='w-full'
            viewMode='large'
          />
        );

      case 2:
        return (
          <div className='space-y-6'>
            <div className='space-y-4'>
              <Label className='text-3xl font-bold'>시간대 선택</Label>
              <ToggleGroup
                type='single'
                value={form.period}
                className='w-1/2 justify-start'
                onValueChange={(value: 'AM' | 'PM') => form.setPeriod(value)}
              >
                <ToggleGroupItem
                  value='AM'
                  className='text-2xl p-3 data-[state=off]:text-muted-foreground'
                >
                  오전
                </ToggleGroupItem>
                <ToggleGroupItem
                  value='PM'
                  className='text-2xl p-3 data-[state=off]:text-muted-foreground'
                >
                  오후
                </ToggleGroupItem>
              </ToggleGroup>

              <div className='flex items-center gap-4 mt-6'>
                <Select value={form.hour} onValueChange={form.setHour}>
                  <SelectTrigger className='w-32 text-2xl p-6 h-auto'>
                    <SelectValue placeholder='시' />
                  </SelectTrigger>
                  <SelectContent>
                    {form.period === 'AM'
                      ? Array.from({ length: 3 }, (_, i) => i + 9).map(
                          (hour) => (
                            <SelectItem
                              key={hour}
                              value={hour.toString()}
                              className='text-2xl p-4'
                            >
                              {hour}
                            </SelectItem>
                          )
                        )
                      : Array.from({ length: 11 }, (_, i) => i + 12).map(
                          (hour) => (
                            <SelectItem
                              key={hour}
                              value={hour.toString()}
                              className='text-2xl p-4'
                            >
                              {hour === 12 ? '12' : `${hour - 12}`}
                            </SelectItem>
                          )
                        )}
                  </SelectContent>
                </Select>

                <span className='text-2xl'>시</span>

                <Select value={form.minute} onValueChange={form.setMinute}>
                  <SelectTrigger className='w-32 text-2xl p-6 h-auto'>
                    <SelectValue placeholder='분' />
                  </SelectTrigger>
                  <SelectContent>
                    {minuteOptions.map((min) => (
                      <SelectItem
                        key={min}
                        value={min.toString()}
                        className='text-2xl p-4'
                      >
                        {min.toString().padStart(2, '0')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className='text-2xl'>분</span>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <div className='space-y-4'>
              <Label htmlFor='people' className='text-3xl font-bold'>
                인원수
              </Label>
              <Input
                id='people'
                type='number'
                min='1'
                value={form.people}
                onChange={(e) => form.setPeople(e.target.value)}
                placeholder='인원수를 입력하세요'
                className='text-2xl p-6 h-auto'
              />
            </div>

            <div className='space-y-4'>
              <Label htmlFor='menu' className='text-2xl'>
                메뉴
              </Label>
              <Select
                value={form.selectedMenu}
                onValueChange={form.setSelectedMenu}
              >
                <SelectTrigger className='text-2xl p-6 h-auto'>
                  <SelectValue placeholder='메뉴를 선택하세요' />
                </SelectTrigger>
                <SelectContent>
                  {MENU_OPTIONS.map((menu) => (
                    <SelectItem
                      key={menu.name}
                      value={menu.name}
                      className='text-2xl p-4'
                    >
                      {menu.name} ({menu.price.toLocaleString()}원)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.selectedMenu && (
                <div className='text-2xl text-green-600 mt-4 font-bold'>
                  총 가격:{' '}
                  {(
                    (MENU_OPTIONS.find((m) => m.name === form.selectedMenu)
                      ?.price || 0) * Number(form.people)
                  ).toLocaleString()}
                  원
                </div>
              )}
            </div>

            <div className='space-y-4 mt-8'>
              <DrinkSelection
                drinks={DRINKS}
                selectedDrinks={form.selectedDrinks}
                drinkInventories={drinkInventories}
                isLoading={isLoading}
                onToggleDrink={toggleDrink}
                isLarge={true}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <div className='space-y-2'>
                <h2 className='text-3xl font-bold'>테이블 선택</h2>
                <p className='text-xl text-muted-foreground'>
                  총 {calculateTotalCapacity()}명
                </p>
              </div>
              <div className='space-x-2'>
                <Button
                  variant='outline'
                  onClick={() =>
                    form.setSelectedTables(
                      [...HALL_1_TABLES, ...HALL_2_TABLES].map((t) => t.number)
                    )
                  }
                  className='text-xl'
                >
                  모두 선택
                </Button>
                <Button
                  variant='outline'
                  onClick={() => form.setSelectedTables([])}
                  className='text-xl'
                >
                  선택 취소
                </Button>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              {/* Hall 1 */}
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <div className='space-y-1'>
                    <div className='text-xl font-bold text-nowrap'>홀 1</div>
                    <div className='text-xl text-muted-foreground text-nowrap'>
                      총 {calculateHallCapacity(HALL_1_TABLES)}명
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <Button
                      variant='outline'
                      onClick={() =>
                        form.setSelectedTables((prev) => {
                          const hallTables = HALL_1_TABLES.map((t) => t.number);
                          const otherTables = prev.filter(
                            (t) => !hallTables.includes(t)
                          );
                          return [...otherTables, ...hallTables];
                        })
                      }
                      className='text-xl w-full'
                    >
                      모두 선택
                    </Button>
                    <Button
                      variant='outline'
                      onClick={() =>
                        form.setSelectedTables((prev) =>
                          prev.filter(
                            (t) =>
                              !HALL_1_TABLES.map(
                                (table) => table.number
                              ).includes(t)
                          )
                        )
                      }
                      className='text-xl w-full'
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
                        variant={
                          form.selectedTables.includes(table.number)
                            ? 'default'
                            : 'outline'
                        }
                        onClick={() => form.toggleTable(table.number)}
                        className={`h-24 flex flex-col items-center justify-center border text-2xl ${
                          form.selectedTables.includes(table.number)
                            ? table.capacity === 6
                              ? 'bg-blue-600 hover:bg-blue-700 border-blue-600'
                              : 'bg-green-600 hover:bg-green-700 border-green-600'
                            : ''
                        }`}
                      >
                        <span>{table.number}번</span>
                        <span className='flex items-center gap-1'>
                          <Users className='h-5 w-5' />
                          {table.capacity}
                        </span>
                      </Button>
                    ))}
                  </div>
                  <div className='grid grid-cols-1 gap-2 mt-2'>
                    {HALL_1_TABLES.slice(4).map((table) => (
                      <Button
                        key={table.number}
                        variant={
                          form.selectedTables.includes(table.number)
                            ? 'default'
                            : 'outline'
                        }
                        onClick={() => form.toggleTable(table.number)}
                        className={`h-24 flex flex-col items-center justify-center border text-2xl ${
                          form.selectedTables.includes(table.number)
                            ? table.capacity === 6
                              ? 'bg-blue-600 hover:bg-blue-700 border-blue-600'
                              : 'bg-green-600 hover:bg-green-700 border-green-600'
                            : ''
                        }`}
                      >
                        <span>{table.number}번</span>
                        <span className='flex items-center gap-1'>
                          <Users className='h-5 w-5' />
                          {table.capacity}
                        </span>
                      </Button>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Hall 2 */}
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <div className='space-y-1'>
                    <div className='text-xl font-bold text-nowrap'>홀 2</div>
                    <div className='text-xl text-muted-foreground text-nowrap'>
                      총 {calculateHallCapacity(HALL_2_TABLES)}명
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <Button
                      variant='outline'
                      onClick={() =>
                        form.setSelectedTables((prev) => {
                          const hallTables = HALL_2_TABLES.map((t) => t.number);
                          const otherTables = prev.filter(
                            (t) => !hallTables.includes(t)
                          );
                          return [...otherTables, ...hallTables];
                        })
                      }
                      className='text-xl w-full'
                    >
                      모두 선택
                    </Button>
                    <Button
                      variant='outline'
                      onClick={() =>
                        form.setSelectedTables((prev) =>
                          prev.filter(
                            (t) =>
                              !HALL_2_TABLES.map(
                                (table) => table.number
                              ).includes(t)
                          )
                        )
                      }
                      className='text-xl w-full'
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
                            variant={
                              form.selectedTables.includes(table.number)
                                ? 'default'
                                : 'outline'
                            }
                            onClick={() => form.toggleTable(table.number)}
                            className={`w-full h-24 flex flex-col items-center justify-center border text-2xl ${
                              form.selectedTables.includes(table.number)
                                ? table.capacity === 6
                                  ? 'bg-blue-600 hover:bg-blue-700 border-blue-600'
                                  : 'bg-green-600 hover:bg-green-700 border-green-600'
                                : ''
                            }`}
                          >
                            <span>{table.number}번</span>
                            <span className='flex items-center gap-1'>
                              <Users className='h-5 w-5' />
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
                            variant={
                              form.selectedTables.includes(table.number)
                                ? 'default'
                                : 'outline'
                            }
                            onClick={() => form.toggleTable(table.number)}
                            className={`w-full h-24 flex flex-col items-center justify-center border text-2xl ${
                              form.selectedTables.includes(table.number)
                                ? table.capacity === 6
                                  ? 'bg-blue-600 hover:bg-blue-700 border-blue-600'
                                  : 'bg-green-600 hover:bg-green-700 border-green-600'
                                : ''
                            }`}
                          >
                            <span>{table.number}번</span>
                            <span className='flex items-center gap-1'>
                              <Users className='h-5 w-5' />
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
                          variant={
                            form.selectedTables.includes(table.number)
                              ? 'default'
                              : 'outline'
                          }
                          onClick={() => form.toggleTable(table.number)}
                          className={`h-24 flex flex-col items-center justify-center border text-2xl ${
                            form.selectedTables.includes(table.number)
                              ? table.capacity === 6
                                ? 'bg-blue-600 hover:bg-blue-700 border-blue-600'
                                : 'bg-green-600 hover:bg-green-700 border-green-600'
                              : ''
                          }`}
                        >
                          <span>{table.number}번</span>
                          <span className='flex items-center gap-1'>
                            <Users className='h-5 w-5' />
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
        );

      case 5:
        return (
          <div className='space-y-6'>
            <h2 className='text-3xl font-bold'>추가 요청사항</h2>
            <div className='space-y-4'>
              <Label htmlFor='specialRequests' className='text-2xl'>
                추가 요청사항 (선택)
              </Label>
              <Textarea
                id='specialRequests'
                value={form.specialRequests}
                onChange={(e) => form.setSpecialRequests(e.target.value)}
                placeholder='추가 요청사항을 입력하세요'
                className='text-2xl p-6 min-h-[200px]'
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className='space-y-6'>
            <h2 className='text-3xl font-bold'>예약 확인</h2>
            <div className='space-y-4 text-2xl'>
              <p className='flex flex-col space-y-2'>
                <strong>고객명:</strong>
                <span className='ml-4'>{form.customerName}</span>
              </p>
              <p className='flex flex-col space-y-2'>
                <strong>예약 시간:</strong>
                <span className='ml-4'>
                  {form.period} {form.hour}:{form.minute}
                </span>
              </p>
              <p className='flex flex-col space-y-2'>
                <strong>인원수:</strong>
                <span className='ml-4'>{form.people}명</span>
              </p>
              <p className='flex flex-col space-y-2'>
                <strong>선택 메뉴:</strong>
                <span className='ml-4'>{form.selectedMenu}</span>
              </p>
              <p className='flex flex-col space-y-2'>
                <strong>선택된 테이블:</strong>
                <span className='ml-4'>{form.selectedTables.join(', ')}번</span>
              </p>
              {form.selectedDrinks.length > 0 && (
                <p className='flex flex-col space-y-2'>
                  <strong>선택된 음료:</strong>
                  <span className='ml-4'>{form.selectedDrinks.join(', ')}</span>
                </p>
              )}
              {form.specialRequests && (
                <p className='flex flex-col space-y-2'>
                  <strong>특이 사항:</strong>
                  <span className='ml-4'>{form.specialRequests}</span>
                </p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className='pt-2 px-2 overflow-y-auto h-full scrollbar-hide mb-1'>
      <StepIndicator
        currentStep={form.step}
        totalSteps={6}
        onBack={form.handleBack}
        onNext={form.handleNext}
        onSubmit={handleSubmit}
        isFirstStep={form.step === 1}
        isLastStep={form.step === 6}
        isNextDisabled={!form.isStepValid()}
      />

      {renderStep()}
    </div>
  );
}
