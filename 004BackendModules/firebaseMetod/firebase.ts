// lib/firebase.ts
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, collection, doc } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth, signInAnonymously, initializeAuth } from "firebase/auth"; // signInAnonymouslyをインポート
import { getReactNativePersistence } from "firebase/auth"; // React Native用の永続化をインポート
import { firebaseConfig } from "../../006Configs/firebaseConfig"; // firebaseConfig2からインポートするように変更
import { ExpoSecureStore } from "./expoSecureStoreAdapter";
  
// Firebaseアプリの初期化
let firebaseApp: FirebaseApp;
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApps()[0];
}
// Firestoreインスタンスを取得
export const db = getFirestore(firebaseApp);
// export const auth = getAuth(firebaseApp); // Authインスタンスを取得
/*
* より安全性の高いexpo-secure-storeに認証情報を保存します
* 認証情報をクリアするにはホーム画面の「自」からサインアウトを押してください
*/
export const auth = initializeAuth(firebaseApp, { 
  persistence: getReactNativePersistence(ExpoSecureStore), 
});
export const firestore = getFirestore(firebaseApp);

// メッセージのドキュメント参照を取得する関数
export const getMessageDocRef = async () => {
  return doc(collection(db, "messages"));
};

// ユーザーIDを取得する関数
export const getUserId = async (): Promise<string | undefined> => {
  try {
    const userCredential = await signInAnonymously(auth); // authを使ってサインイン
    return userCredential.user?.uid; // uidがない場合はundefinedが返る
  } catch (error) {
    console.error("Error signing in anonymously:", error);
    return undefined; // nullではなくundefinedを返す
  }
};
