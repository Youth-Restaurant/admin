// /types/inventory.ts

// 재고 상태 타입
export type InventoryStatus = '충분' | '부족';

// 재고 카테고리 타입 (물품)
export type SupplyCategoryType =
  | '청소용품'
  | '일회용품'
  | '가구'
  | '주방용품'
  | '사무용품';

// 재고 카테고리 타입 (식재료)
export type FoodCategoryType =
  | '채소'
  | '육류'
  | '수산물'
  | '조미료'
  | '곡물'
  | '유제품'
  | '음료';

// 위치 타입 (물품)
export type SupplyLocationType = '주방' | '홀' | '창고';

// 위치 타입 (식재료)
export type FoodLocationType = '주방' | '창고' | '냉장고';

// 재고 아이템 기본 인터페이스
interface BaseInventoryItem {
  id: number;
  name: string;
  quantity: string;
  lastUpdated: string;
  updatedBy: string;
  status: InventoryStatus;
  memo?: string; // 선택적 메모 필드
  minimumQuantity?: string; // 최소 보유량
}

// 물품 타입
export interface SupplyItem extends BaseInventoryItem {
  type: 'supplies';
  category: SupplyCategoryType;
  location: SupplyLocationType;
  manufacturer?: string; // 제조사
  modelNumber?: string; // 모델번호
}

// 식재료 타입
export interface FoodItem extends BaseInventoryItem {
  type: 'food';
  category: FoodCategoryType;
  location: FoodLocationType;
  expirationDate?: string; // 유통기한
  storageTemp?: string; // 보관 온도
}

// 통합 타입
export type InventoryItem = SupplyItem | FoodItem;

// 카테고리 상수
export const SUPPLY_CATEGORIES: SupplyCategoryType[] = [
  '청소용품',
  '일회용품',
  '가구',
  '주방용품',
  '사무용품',
];

export const FOOD_CATEGORIES: FoodCategoryType[] = [
  '채소',
  '육류',
  '수산물',
  '조미료',
  '곡물',
  '유제품',
  '음료',
];

// 위치 정보 상수 (mocks/inventory.ts에서 사용하던 것을 여기로 이동)
export const LOCATIONS = {
  supplies: ['주방', '홀', '창고'] as const,
  food: ['주방', '창고', '냉장고'] as const,
};
