import React, { useCallback, useEffect } from 'react';
import * as Notifications from 'expo-notifications'; 
import * as Device from 'expo-device';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
interface PushNotificationTypes  {
    pushToken? : Notifications.ExpoPushToken | null;
    notification? : Notifications.Notification | null;
}

export const usePushNotification = () : PushNotificationTypes => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  })

  const [expoPushToken, setExpoPushToken] = React.useState<Notifications.ExpoPushToken | null>(null);
  const [notification, setNotification] = React.useState<Notifications.Notification | null>(null);
  const notificationListener = React.useRef<Notifications.EventSubscription>(null);
  const responseListener = React.useRef<Notifications.EventSubscription>(null);

  const isNavigationReady = React.useRef(false);

  const router = useRouter();

  async function registerForPushNotificationsAsync() {
    let token;
    if(Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if(finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
     try{
        token = await Notifications.getExpoPushTokenAsync({
            projectId : Constants.expoConfig?.extra?.eas?.projectId,
        });
     }
     catch(error) {
        console.error('Error getting push token:', error);
        return;
     }
     if(Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
      return token;
    }
  }
  interface NotificationData {
    screen?: string;
    params?: Record<string, string>;
  }

  const handleNotificationResponse = useCallback(
  async (response: Notifications.NotificationResponse) => {

   // Prevent multiple navigations
    if (isNavigationReady.current) return;

    const data = response.notification.request.content.data as NotificationData | undefined;

    if (!data?.screen) return;

    isNavigationReady.current = true;

    try {
      router.push({
        pathname: data.screen,
        params: { ...(data.params || {})},
      });

    } catch (error) {

      console.error("Error handling notification tap:", error);

    } finally {

       // Reset flag after a short delay
      setTimeout(() => {
        isNavigationReady.current = false;
      }, 1000);

    }
  },
  [router]
);
useEffect(() => {

  //sets expo push token
  registerForPushNotificationsAsync().then((token) => {
    setExpoPushToken(token ?? null);
  });

  //sets Notification
  notificationListener.current =
    Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

  // runs handleNotification Response when Notification is clicked
  responseListener.current =
    Notifications.addNotificationResponseReceivedListener(
      handleNotificationResponse
    );

  //cleans up the function
  return () => {
    notificationListener.current?.remove();
    responseListener.current?.remove();
  };
}, [handleNotificationResponse]);

  return {
    pushToken: expoPushToken,
    notification: notification
  };
}