import { useState } from 'react';

export default function usePushNotification() {
  const [permission, setPermission] = useState<NotificationPermission>();

  const requestPermission = async () => {
    const permission = await Notification.requestPermission();
    setPermission(permission);
  };

  const schedulePermission = async () => {
    const permission = await Notification.requestPermission();
    setPermission(permission);
  };

  return { permission, requestPermission, schedulePermission };
}
