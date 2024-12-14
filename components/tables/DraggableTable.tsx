// components/tables/DraggableTable.tsx
import { useDraggable } from '@dnd-kit/core';

interface DraggableTableProps {
  id: number;
  tableNumber: number;
  capacity: number;
  position: { x: number; y: number };
  isVertical: boolean;
  isSelected?: boolean;
  activeDragId?: number;
  dragOffset?: { x: number; y: number };
}

export function DraggableTable({
  id,
  tableNumber,
  capacity,
  position,
  isVertical,
  isSelected,
  activeDragId,
  dragOffset,
}: DraggableTableProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id.toString(),
  });

  const dimensions = isVertical
    ? {
        width: '100px',
        height: `${capacity * 30}px`,
      }
    : {
        width: `${capacity * 30}px`,
        height: '100px',
      };

  const baseStyle = {
    ...dimensions,
    position: 'absolute' as const,
    left: position.x,
    top: position.y,
  };

  const style = {
    ...baseStyle,
    transform: '', // 초기화
  };

  //transform은 useDraggable의 속성으로 드래그 중일 때 테이블의 위치를 계산하는 데 사용됨
  if (transform) {
    style.transform = `translate3d(${position.x + transform.x}px, ${
      position.y + transform.y
    }px, 0)`;
    // 아래 if 문은 테이블이 선택되었을 때 드래그 중일 때 테이블의 위치를 계산하는 데 사용됨
    // activeDragId는 현재 드래그 중인 테이블의 id
    // dragOffset은 현재 드래그 중인 테이블의 위치
  } else if (isSelected && activeDragId && dragOffset) {
    style.transform = `translate3d(${position.x + dragOffset.x}px, ${
      position.y + dragOffset.y
    }px, 0)`;
    // 아래 else 문은 테이블이 선택되지 않았을 때 테이블의 위치를 계산하는 데 사용됨
  } else {
    style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`table bg-gray-200 border rounded-lg p-4 cursor-move shadow-md relative overflow-hidden
        ${
          isSelected || activeDragId === id ? 'ring-2 ring-blue-500' : ''
        } select-none`}
    >
      <div className='absolute inset-0 flex items-center justify-center text-white pointer-events-none'>
        <span className='text-6xl font-bold'>{tableNumber}</span>
      </div>
    </div>
  );
}
