// 'use client';

// import { useState, useEffect } from 'react';
// import {
//   subscribeUser,
//   unsubscribeUser,
//   sendNotification,
// } from '@/app/actions';

// function urlBase64ToUint8Array(base64String: string) {
//   const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
//   const base64 = (base64String + padding)
//     .replace(/-/g, '+') // 백슬래시 제거
//     .replace(/_/g, '/');

//   const rawData = window.atob(base64);
//   const outputArray = new Uint8Array(rawData.length);

//   for (let i = 0; i < rawData.length; ++i) {
//     outputArray[i] = rawData.charCodeAt(i);
//   }
//   return outputArray;
// }

// function PushNotificationManager() {
//   const [isSupported, setIsSupported] = useState(false);
//   const [subscription, setSubscription] = useState<PushSubscription | null>(
//     null
//   );
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     if ('serviceWorker' in navigator && 'PushManager' in window) {
//       setIsSupported(true);
//       registerServiceWorker();
//     }
//   }, []);

//   async function registerServiceWorker() {
//     const registration = await navigator.serviceWorker.register('/sw.js', {
//       scope: '/',
//       updateViaCache: 'none',
//     });
//     const sub = await registration.pushManager.getSubscription();
//     setSubscription(sub);
//   }

//   async function subscribeToPush() {
//     try {
//       // 알림 권한 요청
//       const permission = await Notification.requestPermission();
//       if (permission !== 'granted') {
//         throw new Error('알림 권한이 거부되었습니다.');
//       }

//       const registration = await navigator.serviceWorker.ready;
//       console.log('registration', registration);

//       const sub = await registration.pushManager.subscribe({
//         userVisibleOnly: true,
//         applicationServerKey: urlBase64ToUint8Array(
//           process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? ''
//         ),
//       });

//       console.log('구독 성공:', sub);
//       setSubscription(sub);
//       await subscribeUser(JSON.parse(JSON.stringify(subscription)));
//     } catch (error) {
//       console.error('구독 중 오류 발생:', error);
//     }
//   }

//   async function unsubscribeFromPush() {
//     await subscription?.unsubscribe();
//     setSubscription(null);
//     await unsubscribeUser();
//   }

//   async function sendTestNotification() {
//     if (subscription) {
//       await sendNotification(message);
//       setMessage('');
//     }
//   }

//   if (!isSupported) {
//     return <p>Push notifications are not supported in this browser.</p>;
//   }

//   console.log('subscription', subscription);

//   return (
//     <div>
//       <h3>Push Notifications</h3>
//       {subscription ? (
//         <>
//           <p>You are subscribed to push notifications.</p>
//           <button onClick={unsubscribeFromPush}>Unsubscribe</button>
//           <input
//             type='text'
//             placeholder='Enter notification message'
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//           />
//           <button onClick={sendTestNotification}>Send Test</button>
//         </>
//       ) : (
//         <>
//           <p>You are not subscribed to push notifications.</p>
//           <button onClick={subscribeToPush}>Subscribe</button>
//         </>
//       )}
//     </div>
//   );
// }

// export default PushNotificationManager;

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
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <div>
              <Label
                htmlFor='schedule-switch'
                id='schedule-label'
                className='font-medium text-gray-700 block'
              >
                일정 알림
              </Label>
              <p id='schedule-desc' className='text-sm text-gray-500'>
                예약된 일정 시작 30분 전에 알림을 받습니다
              </p>
            </div>
            <Switch
              id='schedule-switch'
              role='switch'
              aria-checked={schedulePermission === 'granted'}
              aria-labelledby='schedule-label'
              aria-describedby='schedule-desc'
              tabIndex={0}
              checked={schedulePermission === 'granted'}
            />
          </div>
        </div>
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
