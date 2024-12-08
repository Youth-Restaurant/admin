'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { TableButton } from './TableButton';
import { useEffect, useState } from 'react';

interface Table {
  id: string;
  tableNumber: number;
  capacity: number;
  location: string;
}

interface GroupedTables {
  홀1: Table[];
  홀2: Table[];
}

interface TableSectionProps {
  selectedTables: number[];
  onToggleTable: (tableNumber: number) => void;
  onSelectAllTables: () => void;
  onClearTableSelection: () => void;
  onSelectHallTables: (hallTables: number[]) => void;
  onClearHallTables: (hallTables: number[]) => void;
  buttonType: 'button' | 'submit';
}

export function TableSection({
  selectedTables,
  onToggleTable,
  onSelectAllTables,
  onClearTableSelection,
  onSelectHallTables,
  onClearHallTables,
  buttonType,
}: TableSectionProps) {
  const [tables, setTables] = useState<GroupedTables>({
    홀1: [],
    홀2: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch('/api/tables');
        if (!response.ok)
          throw new Error('테이블 정보를 불러오는데 실패했습니다.');

        const data = await response.json();
        setTables(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTables();
  }, []);

  if (isLoading) return <div>테이블 정보를 불러오는 중...</div>;
  if (error) return <div className='text-red-500'>{error}</div>;

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between'>
        <Label className='font-bold'>테이블 선택</Label>
        <div className='space-x-2'>
          <Button
            variant='outline'
            size='sm'
            type={buttonType}
            onClick={onSelectAllTables}
          >
            모두 선택
          </Button>
          <Button
            variant='outline'
            size='sm'
            type={buttonType}
            onClick={onClearTableSelection}
          >
            선택 취소
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        {/* Hall 1 */}
        <div className='space-y-2'>
          <div className='flex items-center gap-2'>
            <div className='text-sm font-medium text-muted-foreground'>
              홀 1
            </div>
            <div className='space-x-2'>
              <Button
                variant='outline'
                size='sm'
                type={buttonType}
                onClick={() =>
                  onSelectHallTables(tables['홀1'].map((t) => t.tableNumber))
                }
              >
                모두 선택
              </Button>
              <Button
                variant='outline'
                size='sm'
                type={buttonType}
                onClick={() =>
                  onClearHallTables(tables['홀1'].map((t) => t.tableNumber))
                }
              >
                선택 취소
              </Button>
            </div>
          </div>
          <Card className='p-2'>
            <div className='grid grid-cols-2 gap-2'>
              {tables['홀1'].slice(0, 4).map((table) => (
                <TableButton
                  key={table.id}
                  tableNumber={table.tableNumber}
                  capacity={table.capacity}
                  isSelected={selectedTables.includes(table.tableNumber)}
                  onClick={() => onToggleTable(table.tableNumber)}
                />
              ))}
            </div>
            <div className='grid grid-cols-1 gap-2 mt-2'>
              {tables['홀1'].slice(4).map((table) => (
                <TableButton
                  key={table.id}
                  tableNumber={table.tableNumber}
                  capacity={table.capacity}
                  isSelected={selectedTables.includes(table.tableNumber)}
                  onClick={() => onToggleTable(table.tableNumber)}
                />
              ))}
            </div>
          </Card>
        </div>

        {/* Hall 2 */}
        <div className='space-y-2'>
          <div className='flex items-center gap-2'>
            <div className='text-sm font-medium text-muted-foreground'>
              홀 2
            </div>
            <div className='space-x-2'>
              <Button
                variant='outline'
                size='sm'
                type={buttonType}
                onClick={() =>
                  onSelectHallTables(tables['홀2'].map((t) => t.tableNumber))
                }
              >
                모두 선택
              </Button>
              <Button
                variant='outline'
                size='sm'
                type={buttonType}
                onClick={() =>
                  onClearHallTables(tables['홀2'].map((t) => t.tableNumber))
                }
              >
                선택 취소
              </Button>
            </div>
          </div>
          <Card className='grid grid-cols-2 gap-2 p-2'>
            <div className='grid'>
              <div className='space-y-1'>
                {tables['홀2']
                  .filter((t) => [7, 8].includes(t.tableNumber))
                  .map((table) => (
                    <TableButton
                      key={table.id}
                      tableNumber={table.tableNumber}
                      capacity={table.capacity}
                      isSelected={selectedTables.includes(table.tableNumber)}
                      onClick={() => onToggleTable(table.tableNumber)}
                      className='w-full'
                    />
                  ))}
              </div>
              <div className='pt-1'>
                {tables['홀2']
                  .filter((t) => t.tableNumber === 9)
                  .map((table) => (
                    <TableButton
                      key={table.id}
                      tableNumber={table.tableNumber}
                      capacity={table.capacity}
                      isSelected={selectedTables.includes(table.tableNumber)}
                      onClick={() => onToggleTable(table.tableNumber)}
                      className='w-full'
                    />
                  ))}
              </div>
            </div>
            <div className='grid grid-cols-1 gap-2'>
              {tables['홀2']
                .filter((t) => [10, 11, 12, 13].includes(t.tableNumber))
                .map((table) => (
                  <TableButton
                    key={table.id}
                    tableNumber={table.tableNumber}
                    capacity={table.capacity}
                    isSelected={selectedTables.includes(table.tableNumber)}
                    onClick={() => onToggleTable(table.tableNumber)}
                  />
                ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
