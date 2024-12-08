import { cn } from '@/lib/utils';
import { Users } from 'lucide-react';

interface TableItemProps {
  tableNumber: number;
  capacity: number;
  isSelected: boolean;
  className?: string;
}

export function TableItem({
  tableNumber,
  capacity,
  isSelected,
  className,
}: TableItemProps) {
  return (
    <div
      className={cn(
        'aspect-square flex flex-col items-center justify-center rounded-md border text-sm',
        isSelected && 'bg-green-100 text-green-800 border-green-200',
        !isSelected && 'text-muted-foreground border-muted',
        className
      )}
    >
      <span className='font-medium'>{tableNumber}번</span>
      <span className='text-xs flex items-center gap-1'>
        <Users className='h-3 w-3' />
        {capacity}인석
      </span>
    </div>
  );
}
