import { firestore, storage } from "../../firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

// 引数をBlobとして利用。fetchによる変換処理は不要となります。
export const uploadPhotoToFirestore = async (imageBlob) => {
  try {
    const storageRef = ref(storage, `photos/${Date.now()}.jpg`);
    await uploadBytes(storageRef, imageBlob);
    const downloadUrl = await getDownloadURL(storageRef);
    await firestore.collection("photos").add({ url: downloadUrl });
    return downloadUrl; // 追加: ダウンロードURLを返す
  } catch (error) {
    console.error("Error uploading photo:", error);
    throw error; // エラーを呼び出し元に伝播
  }
};
