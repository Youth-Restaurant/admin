// components/common/PullToRefresh.tsx
'use client';
import React, { useCallback, useState, useRef } from 'react';
import { Loader2 } from 'lucide-react';

interface PullToRefreshProps {
  onRefresh: () => void;
  children: React.ReactNode;
  className?: string;
  pullThreshold?: number;
  resistance?: number;
  loadingIndicator?: React.ReactNode;
  pullIndicator?: (progress: number) => React.ReactNode;
  disabled?: boolean;
}

export default function PullToRefresh({
  onRefresh,
  children,
  className = '',
  pullThreshold = 80,
  resistance = 2,
  loadingIndicator,
  pullIndicator,
  disabled = false,
}: PullToRefreshProps) {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const startYRef = useRef(0);
  const pullProgress = Math.min(pullDistance / pullThreshold, 1);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (disabled || isRefreshing) return;

      if (window.scrollY === 0) {
        startYRef.current = e.touches[0].clientY;
        setIsPulling(true);
      }
    },
    [disabled, isRefreshing]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isPulling || disabled || isRefreshing) return;

      const currentY = e.touches[0].clientY;
      const distance = Math.max(0, currentY - startYRef.current);

      setPullDistance(distance / resistance);

      if (window.scrollY === 0 && distance > 0) {
        e.preventDefault();
      }
    },
    [isPulling, disabled, isRefreshing, resistance]
  );

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling || disabled) return;

    setIsPulling(false);

    if (pullDistance > pullThreshold) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }

    setPullDistance(0);
  }, [isPulling, disabled, pullDistance, pullThreshold, onRefresh]);

  const defaultLoadingIndicator = (
    <Loader2 className='w-6 h-6 text-gray-500 animate-spin' />
  );

  const defaultPullIndicator = (progress: number) => (
    <Loader2
      className='w-6 h-6 text-gray-500'
      style={{
        transform: `rotate(${progress * 360}deg)`,
      }}
    />
  );

  const renderIndicator = () => {
    if (isRefreshing) {
      return loadingIndicator ?? defaultLoadingIndicator;
    }
    return (pullIndicator ?? defaultPullIndicator)(pullProgress);
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className='absolute left-0 right-0 flex justify-center -top-8'
        style={{
          transform: `translateY(${pullDistance}px)`,
          opacity: pullProgress,
          transition: isPulling ? 'none' : 'all 0.2s ease-out',
        }}
      >
        {renderIndicator()}
      </div>

      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: isPulling ? 'none' : 'transform 0.2s ease-out',
        }}
      >
        {children}
      </div>
    </div>
  );
}
