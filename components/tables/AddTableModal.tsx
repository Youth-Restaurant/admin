// components/tables/AddTableModal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';

interface AddTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (tableData: { tableNumber: number; capacity: number }) => void;
}

export function AddTableModal({ isOpen, onClose, onAdd }: AddTableModalProps) {
  const [tableNumber, setTableNumber] = useState('');
  const [capacity, setCapacity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      tableNumber: parseInt(tableNumber),
      capacity: parseInt(capacity),
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>테이블 추가</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                테이블 번호
              </label>
              <input
                type='number'
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                수용 인원
              </label>
              <input
                type='number'
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
                required
              />
            </div>
            <div className='flex justify-end space-x-3'>
              <button
                type='button'
                onClick={onClose}
                className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md'
              >
                취소
              </button>
              <button
                type='submit'
                className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md'
              >
                추가
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
