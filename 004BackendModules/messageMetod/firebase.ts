// lib/firebase.ts
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, collection, doc } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth, signInAnonymously, initializeAuth } from "firebase/auth"; // signInAnonymouslyをインポート
import { firebaseConfig } from "../../006Configs/firebaseConfig";
  
// Firebaseアプリの初期化
let firebaseApp: FirebaseApp;
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApps()[0];
}
// const app = initializeApp(firebaseConfig); 初期化が2回行われるのを防ぐためにコメントアウトしました
// Firestoreインスタンスを取得
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp); // Authインスタンスを取得
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
