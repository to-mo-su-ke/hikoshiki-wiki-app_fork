// ログイン処理に必要な関数

import { auth } from "../messageMetod/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Alert } from "react-native";
import { ErrorWithCode } from "./errorWithCode";



const SignInWithEmailWithoutVerified = async (email: string, password: string): Promise<string> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("ログイン成功:", userCredential.user.uid);
        return userCredential.user.uid; // ユーザーのUIDを返す
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
            default: // user-token-expiredの対処は保留
                Alert.alert("ログインに失敗しました。メールアドレスとパスワードを確認してください。");
                throw new Error("alert-displayed-error");
        }
        return "" ;
    }
};

export default SignInWithEmailWithoutVerified;
