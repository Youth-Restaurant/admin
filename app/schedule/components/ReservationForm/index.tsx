'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { DRINKS } from '@/constants';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';
import { CustomerSection } from './CustomerSection';
import { TimeSection } from './TimeSection';
import { MenuSection } from './MenuSection';
import { TableSection } from './TableSection';
import { ReservationFormProps, Inventory } from './types';
import { DrinkSelection } from '../DrinkSelection';

const TABLE_OPTIONS = Array.from({ length: 15 }, (_, i) => i + 1);

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

  useEffect(() => {
    if (period === 'AM') {
      setHour('9');
    } else {
      setHour('12');
    }
    setMinute('0');
  }, [period]);

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
    if (currentPeopleCount <= 4) {
      if (selectedTables.includes(tableNumber)) {
        setSelectedTables([]);
      } else {
        setSelectedTables([tableNumber]);
      }
      return;
    }
    setSelectedTables((prev) =>
      prev.includes(tableNumber)
        ? prev.filter((t) => t !== tableNumber)
        : [...prev, tableNumber]
    );
  };

  const selectAllTables = () => setSelectedTables(TABLE_OPTIONS);
  const clearTableSelection = () => setSelectedTables([]);

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

  const isFormValid = () => {
    return (
      customerName.trim() !== '' &&
      selectedTables.length > 0 &&
      people !== '' &&
      Number(people) > 0 &&
      selectedMenu !== ''
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

      router.refresh();
      onClose();
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
        {/* 고객 명칭 */}
        <CustomerSection value={customerName} onChange={setCustomerName} />

        {/* 예약 시간 */}
        <TimeSection
          period={period}
          hour={hour}
          minute={minute}
          onPeriodChange={setPeriod}
          onHourChange={setHour}
          onMinuteChange={setMinute}
        />

        {/* 메뉴 */}
        <MenuSection
          selectedMenu={selectedMenu}
          onMenuChange={setSelectedMenu}
          people={people}
          onPeopleChange={setPeople}
        />

        {/* 테이블 */}
        <TableSection
          selectedTables={selectedTables}
          onToggleTable={toggleTable}
          onSelectAllTables={selectAllTables}
          onClearTableSelection={clearTableSelection}
          onSelectHallTables={selectHallTables}
          onClearHallTables={clearHallTables}
        />

        {/* 음료 */}
        <DrinkSelection
          drinks={DRINKS}
          selectedDrinks={selectedDrinks}
          drinkInventories={drinkInventories}
          isLoading={isLoading}
          onToggleDrink={toggleDrink}
        />

        {/* 특이 사항 */}
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
