import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { MENU_OPTIONS } from '@/constants';
import { Input } from '@/components/ui/input';

interface MenuSectionProps {
  selectedMenu: string;
  onMenuChange: (value: string) => void;
  people: string;
  onPeopleChange: (value: string) => void;
}

export function MenuSection({
  selectedMenu,
  onMenuChange,
  people,
  onPeopleChange,
}: MenuSectionProps) {
  const calculateTotalPrice = () => {
    if (!selectedMenu || !people) return 0;
    const menuItem = MENU_OPTIONS.find((item) => item.name === selectedMenu);
    return menuItem ? menuItem.price * Number(people) : 0;
  };

  return (
    <div className='space-y-2'>
      <Label htmlFor='people' className='font-bold'>
        인원
      </Label>
      <Input
        id='people'
        type='number'
        value={people}
        onChange={(e) => onPeopleChange(e.target.value)}
        className='w-[99%] ml-1'
        min='1'
      />
      <Label htmlFor='menu' className='font-bold'>
        메뉴
      </Label>
      <Select value={selectedMenu} onValueChange={onMenuChange}>
        <SelectTrigger className='w-[99%] ml-1'>
          <SelectValue placeholder='메뉴를 선택하세요' />
        </SelectTrigger>
        <SelectContent>
          {MENU_OPTIONS.map((menu) => (
            <SelectItem key={menu.name} value={menu.name}>
              {menu.name} ({menu.price.toLocaleString()}원)
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedMenu && (
        <div className='text-sm text-green-600 mt-2 font-bold'>
          총 가격: {calculateTotalPrice().toLocaleString()}원
        </div>
      )}
    </div>
  );
}
