import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../firebaseConfig"; // Firebase設定をインポート

// Firebase Storageに画像をアップロードするメソッド
export const uploadImageToFirebase = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storage = getStorage(app);
    const storageRef = ref(storage, `images/${Date.now()}.jpg`); // ファイル名にタイムスタンプを使用
    const uploadTask = uploadBytesResumable(storageRef, blob);
  
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        null,
        (error) => reject(error), // エラー時
        async () => {
          try {
            const storageRef = ref(storage, `images/${Date.now()}_${Math.floor(Math.random() * 10000)}.jpg`);
            resolve(downloadURL); // アップロード完了時にURLを取得
          } catch (error) {
            reject(error); // URL取得時にエラーが発生した場合
          }
        }
      );
    });
  };
