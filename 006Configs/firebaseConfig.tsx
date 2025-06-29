import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, collection, doc } from "firebase/firestore";
import 'firebase/auth';
import 'firebase/firestore';


export const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
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

// Authインスタンスを初期化し、AsyncStorageを提供


// clubtestコレクションの参照を取得する関数
export const getClubTestCollectionRef = () => {
  return collection(db, "clubtest");
};
