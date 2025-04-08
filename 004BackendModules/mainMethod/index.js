import firebase from "firebase/app";
import "firebase/firestore";
import { firebaseConfig } from "../../006Configs/firebaseConfig"; // 共通の設定ファイルをインポート

// Firebaseの初期化
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const firestore = firebase.firestore();

export const submitDataToFirestore = async (data, collectionName) => {
  try {
    await firestore.collection(collectionName).add(data);
  } catch (error) {
    console.error("Error submitting data to Firestore: ", error);
  }
};
