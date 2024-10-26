// 재고품 종류 열거형
enum InventoryType {
  PRODUCT = 'PRODUCT',
  FOOD = 'FOOD',
}

// 공통 기본 타입
interface BaseInventoryData {
  type?: InventoryType;
  name: string;
  location: string;
  registeredBy: string;
  registeredDate: Date;
  purchaseDate?: Date;
  image: string;
  quantity?: number;
  lastViewedDate: Date;
  purchaseLocation?: string;
}

// 물품 타입
interface Product extends BaseInventoryData {
  type: InventoryType.PRODUCT;
  isConsumed?: boolean;
  isBroken?: boolean;
  disposalDate?: Date;
}

// 음식 타입
interface Food extends BaseInventoryData {
  type: InventoryType.FOOD;
  expirationDate: Date;
  disposalDate?: Date; // 폐기일 추가
}

// 업로드용 Request 타입
interface InventoryUploadRequest {
  type?: InventoryType;
  name: string;
  location: string;
  registeredBy: string;
  registeredDate: Date;
  purchaseDate?: Date;
  image: string;
  quantity?: number;
  purchaseLocation?: string;

  // Product specific
  isConsumed?: boolean;
  isBroken?: boolean;
  disposalDate?: Date;

  // Food specific
  expirationDate?: Date;
}

// 타입 가드 함수
function isProduct(inventory: Product | Food): inventory is Product {
  return inventory.type === InventoryType.PRODUCT;
}

function isFood(inventory: Product | Food): inventory is Food {
  return inventory.type === InventoryType.FOOD;
}

// 전체 Inventory 타입 (Union type)
type Inventory = Product | Food;
