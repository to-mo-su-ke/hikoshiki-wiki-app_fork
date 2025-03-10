// firebase-messagingはExpo Goでは動作しない模様．
// https://rnfirebase.io/#expo
// messagingをインポートした時点でエラーとなります．
// 動作させるためにはアプリをビルドする必要があります．
// https://docs.expo.dev/get-started/set-up-your-environment/?mode=development-build

// !! とりあえずExpoGoで動作するように以下はコメントアウトしておきます． !!

// import {getMessaging, getToken, AuthorizationStatus} from '@react-native-firebase/messaging';

export async function initializeMessaging() {
//     const messaging = await getMessaging();
//     if (await messaging.hasPermission() !== AuthorizationStatus.AUTHORIZED) {
//     // 権限がなければリクエストする．拒否された場合はmessagingの使用を中止する
//     const authState = await messaging.requestPermission();
//     if (authState !== AuthorizationStatus.AUTHORIZED) {
//         console.error('Notification permission is not granted.');
//         return;
//     }
//     }

//     // 全ユーザが 'broadcast' トピックを購読するようにする．
//     // (通知の全体送信用)
//     await messaging.subscribeToTopic('broadcast');

//     // 以下でメッセージを受信した際の動作を設定する．
//     // とりあえず受信したメッセージをコンソールに表示するようにしている．
//     messaging.onMessage(async remoteMessage => {
//         // アプリの画面を表示中（フォアグラウンド）でメッセージを受信した場合の動作．
//         // デフォルトでpush通知は行われない．
//         console.log('FCM Message is received at Foreground:', remoteMessage);
//     });
//     messaging.setBackgroundMessageHandler(async remoteMessage => {
//         // アプリの画面を表示していない（バックグラウンド）でメッセージを受信した場合の動作．
//         // デフォルトで（ここに何も記述しなくても）push通知が行われる．
//         console.log('FCM Message is received at Background', remoteMessage);
//     });
}
