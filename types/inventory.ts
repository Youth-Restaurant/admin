import { $Enums } from '@prisma/client';

/**
 * /types/inventory.ts
 * 재고 관리 시스템에서 사용되는 타입 정의
 */
/**
 * 재고 타입 (물품/식재료)
 */
export type InventoryType = $Enums.InventoryType;

/**
 * Enum 한글 매핑
 */
export const INVENTORY_STATUS = {
  SUFFICIENT: '충분',
  LOW: '부족',
} as const satisfies Record<$Enums.InventoryStatus, string>;

export type InventoryStatus = $Enums.InventoryStatus;

export const SUPPLY_CATEGORY = {
  CLEANING: '청소용품',
  DISPOSABLE: '일회용품',
  FURNITURE: '가구',
  KITCHEN: '주방용품',
  OFFICE: '사무용품',
} as const satisfies Record<$Enums.SupplyCategory, string>;

export type SupplyCategoryType =
  (typeof SUPPLY_CATEGORY)[keyof typeof SUPPLY_CATEGORY];

export const FOOD_CATEGORY = {
  VEGETABLE: '채소',
  MEAT: '육류',
  SEAFOOD: '수산물',
  SEASONING: '조미료',
  GRAIN: '곡물',
  DAIRY: '유제품',
  BEVERAGE: '음료',
} as const satisfies Record<$Enums.FoodCategory, string>;

export type FoodCategoryType =
  (typeof FOOD_CATEGORY)[keyof typeof FOOD_CATEGORY];

export const SUPPLY_LOCATION = {
  KITCHEN: '주방',
  HALL: '홀',
  STORAGE: '창고',
} as const satisfies Record<$Enums.SupplyLocation, string>;

export type SupplyLocationType =
  (typeof SUPPLY_LOCATION)[keyof typeof SUPPLY_LOCATION];

export const FOOD_LOCATION = {
  KITCHEN: '주방',
  STORAGE: '창고',
  REFRIGERATOR: '냉장고',
} as const satisfies Record<$Enums.FoodLocation, string>;

export type FoodLocationType =
  (typeof FOOD_LOCATION)[keyof typeof FOOD_LOCATION];

/**
 * 재고 아이템 기본 인터페이스
 */
interface BaseInventoryItem {
  id: number;
  name: string;
  quantity: number;
  lastUpdated: string;
  updatedBy: string;
  status: InventoryStatus;
  memo?: string;
  minimumQuantity?: number;
  imageUrl?: string;
}

/**
 * 물품 타입
 */
export interface SupplyItem extends BaseInventoryItem {
  type: typeof $Enums.InventoryType.SUPPLY;
  category: SupplyCategoryType;
  location: SupplyLocationType;
  manufacturer?: string;
  modelNumber?: string;
}

/**
 * 식재료 타입
 */
export interface FoodItem extends BaseInventoryItem {
  type: typeof $Enums.InventoryType.FOOD;
  category: FoodCategoryType;
  location: FoodLocationType;
  expirationDate?: string;
}

export type InventoryItem = SupplyItem | FoodItem;

/**
 * 카테고리 및 위치 상수
 */
export const SUPPLY_CATEGORIES = Object.values(SUPPLY_CATEGORY);
export const FOOD_CATEGORIES = Object.values(FOOD_CATEGORY);

export const LOCATIONS: Record<
  $Enums.InventoryType,
  $Enums.SupplyLocation[] | $Enums.FoodLocation[]
> = {
  SUPPLY: Object.values($Enums.SupplyLocation),
  FOOD: Object.values($Enums.FoodLocation),
} as const;

/**
 * Enum 매핑
 */
export const ENUM_MAPPINGS = {
  type: {
    SUPPLY: '물품',
    FOOD: '식재료',
  },
  status: INVENTORY_STATUS,
  supplyCategory: SUPPLY_CATEGORY,
  foodCategory: FOOD_CATEGORY,
  supplyLocation: SUPPLY_LOCATION,
  foodLocation: FOOD_LOCATION,
} as const;

/**
 * Upload 타입
 */
export type UploadSupplyItem = Omit<SupplyItem, 'id' | 'lastUpdated'>;
export type UploadFoodItem = Omit<FoodItem, 'id' | 'lastUpdated'>;

/**
 * Enum 유틸리티 타입
 */
export type EnumType = keyof typeof ENUM_MAPPINGS;
export type EnumValue<T extends EnumType> = keyof (typeof ENUM_MAPPINGS)[T];
export type DisplayValue<T extends EnumType> =
  (typeof ENUM_MAPPINGS)[T][EnumValue<T>];

/**
 * Enum 변환 유틸리티 함수들
 */
export const convertEnumToDisplay = <T extends EnumType>(
  type: T,
  enumValue: EnumValue<T>
): DisplayValue<T> => {
  const mapping = ENUM_MAPPINGS[type];
  return mapping[enumValue] as DisplayValue<T>;
};

export const convertDisplayToEnum = <T extends EnumType>(
  type: T,
  displayValue: string
): EnumValue<T> | undefined => {
  const mapping = ENUM_MAPPINGS[type];
  return Object.entries(mapping).find(
    ([, value]) => value === displayValue
  )?.[0] as EnumValue<T>;
};

export const isValidEnumValue = <T extends EnumType>(
  type: T,
  value: unknown
): value is EnumValue<T> => {
  return typeof value === 'string' && value in ENUM_MAPPINGS[type];
};
