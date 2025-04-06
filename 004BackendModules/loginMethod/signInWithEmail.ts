// ログイン処理に必要な関数

import { auth } from "../firebaseMetod/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Alert } from "react-native";
import { ErrorWithCode } from "./errorWithCode";


const checkEmailVerified = async (): Promise<boolean> => {
    const user = auth.currentUser;
    if (!user) return false;
    await user.reload(); // 最新の状態に更新
    return user.emailVerified;
};

const SignInWithEmail = async (email: string, password: string): Promise<string> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("ログイン成功:", userCredential.user.uid);
        const isVerified = await checkEmailVerified();
        console.log("isVerified:", isVerified);
        if (!isVerified) {
            throw new ErrorWithCode("メールアドレスの確認が必要です。");
            return "";
        }
        return userCredential.user.uid; // ユーザーのUIDを返す
        // console.log("ログイン成功:", userCredential.user.uid);
    } catch (error) {
        console.log("ログイン失敗:", error);
        // エラーハンドリング
        switch (error.code) {
            case "auth/user-not-found":
                Alert.alert("ユーザーが見つかりません。");
                throw new Error("alert-displayed-error");
            case "auth/invalid-email":
                Alert.alert("無効なメールアドレスです。");
                throw new Error("alert-displayed-error");
            case "auth/too-many-requests":
                Alert.alert("ログイン試行回数が多すぎます。しばらく待ってから再試行してください。");
                throw new Error("alert-displayed-error");
            case "auth/network-request-failed":
                Alert.alert("ネットワークエラーが発生しました。");
                throw new Error("alert-displayed-error");
            case "email-not-verified":
                Alert.alert("メールアドレスの確認が必要です。");
                throw new Error("alert-displayed-error");
            default: // user-token-expiredの対処は保留
                Alert.alert("ログインに失敗しました。メールアドレスとパスワードを確認してください。");
                throw new Error("alert-displayed-error");
        }
        return "" ;
    }
};

export default SignInWithEmail;
