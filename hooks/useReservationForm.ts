import { useState, useLayoutEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { createReservation } from '../app/lib/actions/reservation';

interface UseReservationFormProps {
  selectedDate: Date;
  onClose: () => void;
}

export function useReservationForm({
  selectedDate,
  onClose,
}: UseReservationFormProps) {
  const [step, setStep] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [selectedTables, setSelectedTables] = useState<number[]>([]);
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');
  const [hour, setHour] = useState('9');
  const [minute, setMinute] = useState('0');
  const [people, setPeople] = useState('2');
  const [selectedMenu, setSelectedMenu] = useState<string>('점심특선');
  const [specialRequests, setSpecialRequests] = useState('');
  const [selectedDrinks, setSelectedDrinks] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useLayoutEffect(() => {
    if (period === 'AM') {
      setHour('9');
    } else {
      setHour('12');
    }
    setMinute('0');
  }, [period]);

  const handleSubmit = async () => {
    if (!isStepValid()) return;

    setIsSubmitting(true);
    try {
      const reservationData = {
        guestName: customerName,
        reservationDate: new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          period === 'AM' ? Number(hour) : Number(hour) + 12,
          Number(minute)
        ).toISOString(),
        numberOfGuests: Number(people),
        tableNumbers: selectedTables,
        menuOption: selectedMenu,
        drinks: selectedDrinks,
        specialRequests: specialRequests,
      };

      await createReservation(reservationData);

      toast({
        title: '예약 완료',
        description: '예약이 성공적으로 등록되었습니다.',
      });

      router.refresh();
      onClose();
    } catch (error) {
      console.error(error);
      toast({
        title: '예약 실패',
        description: '예약 등록 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return customerName.trim() !== '';
      case 2:
        return people !== '' && Number(people) > 0;
      case 3:
        return selectedMenu !== '';
      case 4:
        return selectedTables.length > 0;
      case 5:
        return true; // Special requests are optional
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < 6) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

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

  return {
    step,
    customerName,
    selectedTables,
    period,
    hour,
    minute,
    people,
    selectedMenu,
    specialRequests,
    selectedDrinks,
    isSubmitting,
    setCustomerName,
    setSelectedTables,
    setPeriod,
    setHour,
    setMinute,
    setPeople,
    setSelectedMenu,
    setSpecialRequests,
    setSelectedDrinks,
    handleSubmit,
    isStepValid,
    handleNext,
    handleBack,
    toggleTable,
  };
}
