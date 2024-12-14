'use client';
// app/tables/layout/page.tsx
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragMoveEvent,
} from '@dnd-kit/core';
import { useState, useRef } from 'react';
import { DraggableTable } from '@/components/tables/DraggableTable';
import { AddTableModal } from '@/components/tables/AddTableModal';
import { Table } from '@/types/table';
export default function TableLayout() {
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTables, setSelectedTables] = useState<Table['id'][]>([]);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(
    null
  );
  const [activeDragId, setActiveDragId] = useState<Table['id'] | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectionArea, setSelectionArea] = useState<{
    start: { x: number; y: number };
    end: { x: number; y: number };
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.table')) return; // 테이블 위에서는 선택 영역 시작하지 않음

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    setSelectionArea({
      start: { x: e.clientX - rect.left, y: e.clientY - rect.top },
      end: { x: e.clientX - rect.left, y: e.clientY - rect.top },
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!selectionArea || isDragging) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    setSelectionArea({
      ...selectionArea,
      end: { x: e.clientX - rect.left, y: e.clientY - rect.top },
    });

    // 선택 영역 내의 테이블 찾기
    const selectedIds = tables
      .filter((table) => {
        const tableRect = {
          left: table.position.x,
          right:
            table.position.x + (table.isVertical ? 100 : table.capacity * 30),
          top: table.position.y,
          bottom:
            table.position.y + (table.isVertical ? table.capacity * 30 : 100),
        };

        const selectionRect = {
          left: Math.min(selectionArea.start.x, e.clientX - rect.left),
          right: Math.max(selectionArea.start.x, e.clientX - rect.left),
          top: Math.min(selectionArea.start.y, e.clientY - rect.top),
          bottom: Math.max(selectionArea.start.y, e.clientY - rect.top),
        };

        return !(
          tableRect.left > selectionRect.right ||
          tableRect.right < selectionRect.left ||
          tableRect.top > selectionRect.bottom ||
          tableRect.bottom < selectionRect.top
        );
      })
      .map((table) => table.id);

    setSelectedTables(selectedIds);
  };

  const handleMouseUp = () => {
    setSelectionArea(null);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setIsDragging(true);
    setActiveDragId(event.active.id as Table['id']);
  };

  const handleDragMove = (event: DragMoveEvent) => {
    if (!activeDragId) return;
    setDragOffset({ x: event.delta.x, y: event.delta.y });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    setIsDragging(false);
    setActiveDragId(null);
    setDragOffset(null);

    if (
      selectedTables.length > 0 &&
      selectedTables.includes(active.id as Table['id'])
    ) {
      // 선택된 테이블들 모두 이동
      setTables(
        tables.map((table) => {
          if (selectedTables.includes(table.id)) {
            return {
              ...table,
              position: {
                x: table.position.x + delta.x,
                y: table.position.y + delta.y,
              },
            };
          }
          return table;
        })
      );
    } else {
      // 기존 단일 테이블 이동 로직
      const activeTable = tables.find((t) => t.id === active.id);
      if (!activeTable) return;

      // 새로운 위치 계산
      const newPosition = {
        x: activeTable.position.x + delta.x,
        y: activeTable.position.y + delta.y,
      };

      // 테이블 크기 계산
      const tableWidth = activeTable.isVertical
        ? 100
        : activeTable.capacity * 30;
      const tableHeight = activeTable.isVertical
        ? activeTable.capacity * 30
        : 100;

      // 화면 경계 체크
      const boundedPosition = {
        x: Math.max(0, Math.min(newPosition.x, window.innerWidth - tableWidth)),
        y: Math.max(
          0,
          Math.min(newPosition.y, window.innerHeight - tableHeight)
        ),
      };

      // 다른 테이블과의 충돌 체크
      let finalPosition = { ...boundedPosition };
      let hasCollision = false;

      tables.forEach((table) => {
        if (table.id === active.id) return;

        const otherTableWidth = table.isVertical ? 100 : table.capacity * 30;
        const otherTableHeight = table.isVertical ? table.capacity * 30 : 100;

        const tableRect = {
          left: table.position.x,
          right: table.position.x + otherTableWidth,
          top: table.position.y,
          bottom: table.position.y + otherTableHeight,
        };

        const newRect = {
          left: boundedPosition.x,
          right: boundedPosition.x + tableWidth,
          top: boundedPosition.y,
          bottom: boundedPosition.y + tableHeight,
        };

        // 충돌 감지
        if (
          !(
            newRect.left > tableRect.right ||
            newRect.right < tableRect.left ||
            newRect.top > tableRect.bottom ||
            newRect.bottom < tableRect.top
          )
        ) {
          hasCollision = true;

          // 가장 가까운 비충돌 위치 찾기
          const distances = {
            right: Math.abs(newRect.left - tableRect.right),
            left: Math.abs(newRect.right - tableRect.left),
            bottom: Math.abs(newRect.top - tableRect.bottom),
            top: Math.abs(newRect.bottom - tableRect.top),
          };

          const minDistance = Math.min(...Object.values(distances));

          if (distances.right === minDistance) {
            finalPosition.x = tableRect.right + 5;
          } else if (distances.left === minDistance) {
            finalPosition.x = tableRect.left - tableWidth - 5;
          } else if (distances.bottom === minDistance) {
            finalPosition.y = tableRect.bottom + 5;
          } else {
            finalPosition.y = tableRect.top - tableHeight - 5;
          }

          // 새 위치가 화면 경계를 벗어나지 않도록 재조정
          finalPosition = {
            x: Math.max(
              0,
              Math.min(finalPosition.x, window.innerWidth - tableWidth)
            ),
            y: Math.max(
              0,
              Math.min(finalPosition.y, window.innerHeight - tableHeight)
            ),
          };
        }
      });

      // 위치 업데이트
      setTables(
        tables.map((table) =>
          table.id === active.id ? { ...table, position: finalPosition } : table
        )
      );
    }
  };

  const handleAddTable = (tableData: {
    tableNumber: number;
    capacity: number;
  }) => {
    // 새 테이블 추가 로직
    setTables([
      ...tables,
      {
        id: tableData.tableNumber,
        ...tableData,
        position: { x: 0, y: 0 },
        isVertical: false,
      },
    ]);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (
      selectedTables.length > 0 &&
      !(e.target as HTMLElement).closest('.table')
    ) {
      setSelectedTables([]);
    }
  };

  return (
    <div
      ref={containerRef}
      className='fixed inset-0 w-full h-full bg-gray-50 z-[60] overflow-hidden'
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseDownCapture={handleClick}
    >
      <DndContext
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
      >
        {tables.map((table) => (
          <DraggableTable
            key={table.id}
            {...table}
            isSelected={selectedTables.includes(table.id)}
            activeDragId={activeDragId || undefined}
            dragOffset={dragOffset || undefined}
          />
        ))}
      </DndContext>
      {selectionArea && (
        <div
          className='absolute border-2 border-blue-500 bg-blue-100 bg-opacity-20'
          style={{
            left: Math.min(selectionArea.start.x, selectionArea.end.x),
            top: Math.min(selectionArea.start.y, selectionArea.end.y),
            width: Math.abs(selectionArea.end.x - selectionArea.start.x),
            height: Math.abs(selectionArea.end.y - selectionArea.start.y),
            pointerEvents: 'none',
          }}
        />
      )}
      <button
        onClick={() => setIsModalOpen(true)}
        className='fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg z-[61]'
      >
        + 테이블 추가
      </button>
      <AddTableModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddTable}
      />
    </div>
  );
}
