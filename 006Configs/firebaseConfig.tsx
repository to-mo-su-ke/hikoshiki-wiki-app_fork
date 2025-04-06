import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, collection, doc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAuth, getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDBUTuJaOcEdQvT2jAaoEdZV52IPQDKqH4",
  authDomain: "unofficialwikigroup4.firebaseapp.com",
  databaseURL: "https://unofficialwikigroup4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "unofficialwikigroup4",
  storageBucket: "unofficialwikigroup4.appspot.com",
  messagingSenderId: "942892902022",
  appId: "1:942892902022:web:d0432a88360497a12e1307",
  measurementId: "G-CGSGNBQ2GD"
};

// Firebaseアプリの初期化
let firebaseApp: FirebaseApp;
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApps()[0];
}

// Firestoreインスタンスを取得
export const db = getFirestore(firebaseApp);

// Storageインスタンスを取得
export const storage = getStorage(firebaseApp);

// clubtestコレクションの参照を取得する関数
export const getClubTestCollectionRef = () => {
  return collection(db, "clubtest");
};

//コンフィグをエクスポート
export { firebaseConfig };