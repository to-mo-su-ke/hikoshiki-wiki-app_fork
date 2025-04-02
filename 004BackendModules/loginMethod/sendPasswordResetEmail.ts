import { auth } from '../messageMetod/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';


const sendPasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) { //エラー時に「メールが送信できませんでした。」と表示する。
    console.log('メールが送信できませんでした。');
    throw new Error('メールが送信できませんでした。');
  }
}
export default sendPasswordReset;