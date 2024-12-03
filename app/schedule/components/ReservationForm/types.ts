export interface ReservationFormProps {
  onClose: () => void;
  selectedDate: Date;
}

export interface Inventory {
  id: number;
  name: string;
  quantity: number | null;
  status: 'SUFFICIENT' | 'LOW';
}

export interface SectionProps {
  value: string;
  onChange: (value: string) => void;
}
