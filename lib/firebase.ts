// lib/firebase.ts
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, collection, doc } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth, signInAnonymously, initializeAuth } from "firebase/auth"; // signInAnonymouslyをインポート

// Firebaseの設定オブジェクト
export const firebaseConfig = {
  apiKey: "AIzaSyDBUTuJaOcEdQvT2jAaoEdZV52IPQDKqH4",
  authDomain: "unofficialwikigroup4.firebaseapp.com",
  databaseURL:
    "https://unofficialwikigroup4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "unofficialwikigroup4",
  storageBucket: "unofficialwikigroup4.appspot.com",
  messagingSenderId: "942892902022",
  appId: "1:942892902022:web:d0432a88360497a12e1307",
  measurementId: "G-CGSGNBQ2GD",
};

// Firebaseアプリの初期化
let firebaseApp: FirebaseApp;
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApps()[0];
}
const app = initializeApp(firebaseConfig);
// Firestoreインスタンスを取得
export const db = getFirestore(firebaseApp);
const auth = getAuth(app); // Authインスタンスを取得
export const firestore = getFirestore(app);

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
