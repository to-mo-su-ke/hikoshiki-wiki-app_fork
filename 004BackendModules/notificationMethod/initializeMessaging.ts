// https://zenn.dev/yumemi9808/articles/f0da7987eb524d
// https://rnfirebase.io/#expo
import messaging from '@react-native-firebase/messaging';

import { firestore } from '../messageMetod/firestore';
import { getUserId } from '../messageMetod/firebase';

export async function initializeMessaging() {
  console.log('initializeMessaging');
    if (!await requestPermission()) return;
    const FCMToken = await messaging().getToken();
    firestore.collection('FCMTokens').add({
        token: FCMToken,
        user: await getUserId(),
        createdAt: new Date(),
    });
    console.log('FCMToken:', FCMToken);
}

async function requestPermission() {
    const authStatus = await messaging().requestPermission()
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL
  
    if (enabled) {
      console.log('Authorization status:', authStatus);
      return true;
    }
    return false;
}