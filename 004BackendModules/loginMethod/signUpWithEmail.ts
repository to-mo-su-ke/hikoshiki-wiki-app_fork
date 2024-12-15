//メールアドレスとパスワードでユーザー登録する関数です

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../messageMetod/firebase";

const SignUpWithEmail = async (email: string, password: string) => {

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user.uid;
    } catch (error) {
      console.error("Error signing up with email:", error);
      throw error;
    }
  };

export default SignUpWithEmail;
