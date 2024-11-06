import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

// Firebaseの設定情報を取得して設定する
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

// Firebaseアプリが初期化されていない場合は初期化
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const firestore = firebase.firestore();

export { firestore };
