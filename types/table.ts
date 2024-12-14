export interface Table {
  id: number;
  tableNumber: number;
  capacity: number;
  position: {
    x: number;
    y: number;
  };
  isVertical: boolean;
}
