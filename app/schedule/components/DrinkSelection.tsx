import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { type Inventory } from '@/lib/utils/inventory';

interface DrinkSelectionProps {
  drinks: readonly string[];
  selectedDrinks: string[];
  drinkInventories: Record<string, Inventory>;
  isLoading: boolean;
  onToggleDrink: (drink: string) => void;
  isLarge?: boolean;
}

export function DrinkSelection({
  drinks,
  selectedDrinks,
  drinkInventories,
  isLoading,
  onToggleDrink,
  isLarge = false,
}: DrinkSelectionProps) {
  return (
    <div className='space-y-2'>
      <Label className={`font-bold ${isLarge ? 'text-3xl' : ''}`}>
        음료 선택
      </Label>
      <div className='flex flex-wrap gap-2 ml-1'>
        {drinks.map((drink) => {
          const inventory = drinkInventories[drink];
          const quantity = inventory?.quantity ?? 0;
          const status = inventory?.status ?? 'LOW';

          return (
            <Button
              key={drink}
              variant={selectedDrinks.includes(drink) ? 'default' : 'outline'}
              onClick={() => onToggleDrink(drink)}
              className={`w-24 h-24 flex flex-col items-center justify-center ${
                isLarge ? 'text-2xl' : ''
              }`}
              disabled={quantity === 0 || status === 'LOW'}
            >
              <div className='flex flex-col items-center'>
                <span>{drink}</span>
                <span
                  className={`mt-1 ${
                    status === 'LOW' ? 'text-red-500' : 'text-green-500'
                  } ${isLarge ? 'text-lg' : 'text-xs'}`}
                >
                  {isLoading
                    ? '로딩중...'
                    : quantity === -1
                    ? '무제한'
                    : `재고: ${quantity}개`}
                </span>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
