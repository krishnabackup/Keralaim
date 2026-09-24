
import admin from 'firebase-admin';
import { PushNotificationPayload } from '../../types/alerts.types';

let firebaseInitialized = false;

function initFirebase(): void {
  if (firebaseInitialized) return;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  if (!projectId || !privateKey || !clientEmail) {
    console.error('❌ Firebase init failed: Missing Firebase credentials');
    return;
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        privateKey,
        clientEmail,
      }),
    });
    firebaseInitialized = true;
    console.log('✅ Firebase Admin SDK initialized');
  } catch (err) {
    console.error('❌ Firebase init failed:', (err as Error).message);
  }
}

export async function sendPushNotification({
  topic,
  title,
  body,
  data = {},
}: PushNotificationPayload): Promise<void> {
  initFirebase();
  if (!firebaseInitialized) return;

  try {
    const message: admin.messaging.Message = {
      topic,
      notification: { title, body },
      data: { ...data, click_action: 'FLUTTER_NOTIFICATION_CLICK' },
      android: {
        priority: 'high',
        notification: {
          channelId: 'disaster_alerts',
          priority: 'max',
          defaultSound: true,
          defaultVibrateTimings: true,
        },
      },
      apns: {
        payload: {
          aps: { sound: 'default', badge: 1, contentAvailable: true },
        },
      },
    };

    const response = await admin.messaging().send(message);
    console.log(`📩 Push sent to [${topic}]:`, response);
  } catch (err) {
    console.error(`❌ Push failed for [${topic}]:`, (err as Error).message);
  }
}

export async function sendToDevice(
  token: string,
  title: string,
  body: string,
  data: Record<string, string> = {}
): Promise<void> {
  initFirebase();
  if (!firebaseInitialized) return;

  try {
    const message: admin.messaging.Message = {
      token,
      notification: { title, body },
      data,
      android: { priority: 'high' },
    };
    await admin.messaging().send(message);
  } catch (err) {
    console.error('❌ sendToDevice failed:', (err as Error).message);
  }
}

export async function subscribeToTopic(tokens: string[], topic: string): Promise<void> {
  initFirebase();
  if (!firebaseInitialized) return;
  try {
    await admin.messaging().subscribeToTopic(tokens, topic);
    console.log(`✅ Subscribed ${tokens.length} device(s) to [${topic}]`);
  } catch (err) {
    console.error('❌ subscribeToTopic failed:', (err as Error).message);
  }
}