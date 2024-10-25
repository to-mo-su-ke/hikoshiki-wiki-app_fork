// backend.js
import { firestore } from "./firebaseConfig";

export const submitDataToFirestore = async (data) => {
  try {
    await firestore.collection("userInputs").add(data);
    console.log("データが正常に送信されました");
  } catch (error) {
    console.error("Firestoreへの送信エラー: ", error);
  }
};
