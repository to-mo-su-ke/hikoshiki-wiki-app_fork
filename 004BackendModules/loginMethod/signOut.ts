// サインアウト処理を実装します。
import { getAuth, signOut } from 'firebase/auth';
import { auth } from '../messageMetod/firebase';

export async function doSignOut() {
  try {
    // Firebase Authからサインアウト
    await signOut(auth);
    console.log("サインアウト成功");
  } catch (error) {
    console.error("サインアウトエラー:", error);
  }
}

