'use client';
import React, { useRef, useState, useEffect } from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function DraggableScroll({ children, className = '' }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const onMouseDown = (e: React.MouseEvent) => {
    console.log(e.target);

    setIsDragging(true);
    setStartY(e.pageY - (containerRef.current?.offsetTop || 0));
    setScrollTop(containerRef.current?.scrollTop || 0);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const y = e.pageY - (containerRef.current?.offsetTop || 0);
    const walk = (y - startY) * 1;
    if (containerRef.current) {
      containerRef.current.scrollTop = scrollTop - walk;
    }
  };

  const onMouseUp = (e: MouseEvent) => {
    setIsDragging(false);
  };

  const onMouseLeave = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, startY, scrollTop]);

  return (
    <div
      ref={containerRef}
      className={`${className} ${
        isDragging
          ? 'cursor-grabbing select-none [&_*]:pointer-events-none'
          : 'cursor-default hover:cursor-grab'
      } h-[calc(100vh-var(--header-height)-var(--bottom-nav-height))] overflow-y-auto`}
      onMouseDown={onMouseDown}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
}
