import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { firebaseConfig } from "../../006Configs/firebaseConfig"; // firebaseConfigをインポート

// Firebaseアプリが初期化されていない場合は初期化
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const firestore = firebase.firestore();

export { firestore };

export const submitDataToFirestore = async (data, collectionName) => {
  try {
    await firestore.collection(collectionName).add(data); // 引数で受け取ったコレクション名を使用
    console.log("データが正常に送信されました");
  } catch (error) {
    console.error("Firestoreへの送信エラー: ", error);
  }
};