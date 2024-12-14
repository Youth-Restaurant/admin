// app/tables/page.tsx
'use client';
import { DraggableTable } from '@/components/tables/DraggableTable';
import { RestaurantTable } from '@prisma/client';
import { useEffect, useState } from 'react';

export default function TablesPage() {
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch('/api/tables');
        if (!response.ok) {
          throw new Error('Failed to fetch tables');
        }
        const data = await response.json();
        setTables(data['홀1']);
        setIsLoading(false);
      } catch (err) {
        setError(err as Error);
        setIsLoading(false);
      }
    };

    fetchTables();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <div className='fixed inset-0 w-full h-full bg-gray-50 z-[60] overflow-hidden'>
      {tables.map((table) => (
        <DraggableTable
          key={table.id}
          {...table}
          position={{ x: table.positionX, y: table.positionY }}
          isVertical={table.isVertical}
        />
      ))}
    </div>
  );
}
