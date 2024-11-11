import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

// Firebaseの設定情報を取得して設定する
const firebaseConfig = {
  apiKey: "AIzaSyABT5pEPk4QpsxElFk3E1IElr4Y3ICuYYs",
  authDomain: "rio-s-tets.firebaseapp.com",
  projectId: "rio-s-tets",
  storageBucket: "rio-s-tets.appspot.com",
  messagingSenderId: "1087006869767",
  appId: "1:1087006869767:web:e9a796972e40dd10d15da2",
};

const app=firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();

export { app,firestore };
