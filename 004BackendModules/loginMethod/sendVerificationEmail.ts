//サインアップ後にメールアドレスの確認メールを送信する関数です

import { auth } from '../messageMetod/firebase';
import { sendEmailVerification } from 'firebase/auth';

const sendVerificationEmail = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      await sendEmailVerification(user);
    }
  } catch (error) { //エラー時に「メールが送信できませんでした。メールアドレスを確認してください」と表示する。アプリが強制終了しないようにする
    console.error('Error sending email verification:', error);
    throw error;
  }
}

export default sendVerificationEmail;