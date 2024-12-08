import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

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

export function useReservations(selectedDate: Date | null) {
  const [reservations, setReservations] = useState<ReservationWithCreatedBy[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedDate) return;

    const fetchReservations = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/reservations?date=${format(selectedDate, 'yyyy-MM-dd')}`
        );

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? '예약 정보를 찾을 수 없습니다.'
              : '예약 정보를 불러오는데 실패했습니다.'
          );
        }

        const data = await response.json();
        setReservations(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : '알 수 없는 오류가 발생했습니다.';
        setError(errorMessage);
        toast({
          title: '오류 발생',
          description: errorMessage,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, [selectedDate]);

  return { reservations, isLoading, error };
}
