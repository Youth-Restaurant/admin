import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface TimeSectionProps {
  period: 'AM' | 'PM';
  hour: string;
  minute: string;
  onPeriodChange: (value: 'AM' | 'PM') => void;
  onHourChange: (value: string) => void;
  onMinuteChange: (value: string) => void;
}

export function TimeSection({
  period,
  hour,
  minute,
  onPeriodChange,
  onHourChange,
  onMinuteChange,
}: TimeSectionProps) {
  const minuteOptions = Array.from({ length: 12 }, (_, i) => i * 5);

  return (
    <div className='space-y-2'>
      <Label className='font-bold'>예약 시간</Label>
      <div className='flex items-center gap-2'>
        <ToggleGroup
          type='single'
          value={period}
          className='bg-background'
          onValueChange={onPeriodChange}
        >
          <ToggleGroupItem
            value='AM'
            className='data-[state=off]:text-muted-foreground'
          >
            오전
          </ToggleGroupItem>
          <ToggleGroupItem
            value='PM'
            className='data-[state=off]:text-muted-foreground'
          >
            오후
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className='flex items-center gap-2 ml-1'>
        <Select value={hour} onValueChange={onHourChange}>
          <SelectTrigger className='w-24'>
            <SelectValue placeholder='시' />
          </SelectTrigger>
          <SelectContent>
            {period === 'PM'
              ? Array.from({ length: 11 }, (_, i) => i + 12).map((hour) => (
                  <SelectItem key={hour} value={hour.toString()}>
                    {hour === 12 ? '12' : `${hour - 12}`}
                  </SelectItem>
                ))
              : Array.from({ length: 3 }, (_, i) => i + 9).map((hour) => (
                  <SelectItem key={hour} value={hour.toString()}>
                    {hour}
                  </SelectItem>
                ))}
          </SelectContent>
        </Select>

        <span>시</span>

        <Select value={minute} onValueChange={onMinuteChange}>
          <SelectTrigger className='w-24'>
            <SelectValue placeholder='분' />
          </SelectTrigger>
          <SelectContent>
            {minuteOptions.map((min) => (
              <SelectItem key={min} value={min.toString()}>
                {min.toString().padStart(2, '0')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span>분</span>
      </div>
    </div>
  );
}
