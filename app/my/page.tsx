'use client';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useEffect, useState } from 'react';

export default function NotificationButton() {
  // 컴포넌트 마운트 시 권한 상태 확인
  const [permission, setPermission] = useState<NotificationPermission | null>(
    null
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestNotiPermission = async () => {
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
    } catch (error) {
      console.error('알림 권한 요청 실패:', error);
    }
  };

  if (!mounted) return null;

  // 권한 상태에 따른 UI 렌더링
  return (
    <div className='pt-5 flex flex-col items-center'>
      <fieldset className='w-full border border-gray-200 rounded-xl p-6 max-w-md shadow-sm bg-white'>
        <legend className='text-lg font-semibold px-3 text-gray-800 bg-white'>
          알림 권한
        </legend>

        <p
          id='notification-desc'
          className='text-gray-500 text-sm mb-5 leading-relaxed'
        >
          알림 권한을 허용하면 공지사항 알림을 받을 수 있습니다.
        </p>

        <div className='flex items-center justify-between px-1'>
          <Label
            htmlFor='notification-switch'
            id='notification-label'
            className='font-medium text-gray-700'
          >
            공지사항 알림
          </Label>
          <Switch
            id='notification-switch'
            role='switch'
            aria-checked={permission === 'granted'}
            aria-labelledby='notification-label'
            aria-describedby='notification-desc'
            tabIndex={0}
            checked={permission === 'granted'}
          />
        </div>

        {/* 구분선 */}
        <div className='border-t border-gray-200' />
        {/* 일정 알림 */}
      </fieldset>
      {permission === 'granted' && <p>✅ 알림이 허용되었습니다</p>}
      {permission === 'denied' && (
        <p>❌ 알림이 차단되었습니다. 브라우저 설정에서 변경해주세요.</p>
      )}
      {permission === 'default' && (
        <button onClick={requestNotiPermission}>알림 권한 요청하기</button>
      )}
    </div>
  );
}
