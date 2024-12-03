import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Users } from 'lucide-react';
import { HALL_1_TABLES, HALL_2_TABLES } from '@/constants';

interface TableSectionProps {
  selectedTables: number[];
  onToggleTable: (tableNumber: number) => void;
  onSelectAllTables: () => void;
  onClearTableSelection: () => void;
  onSelectHallTables: (hallTables: number[]) => void;
  onClearHallTables: (hallTables: number[]) => void;
}

export function TableSection({
  selectedTables,
  onToggleTable,
  onSelectAllTables,
  onClearTableSelection,
  onSelectHallTables,
  onClearHallTables,
}: TableSectionProps) {
  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between'>
        <Label className='font-bold'>테이블 선택</Label>
        <div className='space-x-2'>
          <Button
            variant='outline'
            size='sm'
            type='button'
            onClick={onSelectAllTables}
          >
            모두 선택
          </Button>
          <Button
            variant='outline'
            size='sm'
            type='button'
            onClick={onClearTableSelection}
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
                  onSelectHallTables(HALL_1_TABLES.map((t) => t.number))
                }
              >
                모두 선택
              </Button>
              <Button
                variant='outline'
                size='sm'
                type='button'
                onClick={() =>
                  onClearHallTables(HALL_1_TABLES.map((t) => t.number))
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
                  onClick={() => onToggleTable(table.number)}
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
                  onClick={() => onToggleTable(table.number)}
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
                  onSelectHallTables(HALL_2_TABLES.map((t) => t.number))
                }
              >
                모두 선택
              </Button>
              <Button
                variant='outline'
                size='sm'
                type='button'
                onClick={() =>
                  onClearHallTables(HALL_2_TABLES.map((t) => t.number))
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
                  const table = HALL_2_TABLES.find((t) => t.number === number);
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
                      onClick={() => onToggleTable(table.number)}
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
          </Card>
        </div>
      </div>
    </div>
  );
}
