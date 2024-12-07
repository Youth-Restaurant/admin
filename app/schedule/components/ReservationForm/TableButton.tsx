import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

interface TableButtonProps {
  tableNumber: number;
  capacity: number;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
}

export function TableButton({
  tableNumber,
  capacity,
  isSelected,
  onClick,
  className = '',
}: TableButtonProps) {
  return (
    <Button
      type='button'
      variant={isSelected ? 'default' : 'outline'}
      onClick={onClick}
      className={`h-13 flex flex-col items-center justify-center border ${
        isSelected
          ? capacity === 6
            ? 'bg-blue-600 hover:bg-blue-700 border-blue-600'
            : 'bg-green-600 hover:bg-green-700 border-green-600'
          : ''
      } ${className}`}
    >
      <span>{tableNumber}번</span>
      <span className='text-sm flex items-center gap-1'>
        <Users className='h-3 w-3' />
        {capacity}
      </span>
    </Button>
  );
}
