// ローディング画面
// 認証状態を確認中に表示する画面

import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { auth } from "../../004BackendModules/messageMetod/firebase";
import { onAuthStateChanged } from 'firebase/auth';


const LoadingScreen = ({ navigation }) => {
  enum Status {
    LOADING = 'loading',
    SIGNED_IN = 'signedIn',
    NEED_EMAIL_VERIFICATION = 'needEmailVerification',
    SIGNED_OUT = 'signedOut',
  }
  const [user, setUser] = useState(null); //後でnullに直す
  const [authState, setAuthState] = useState(Status.LOADING); // 認証状態を管理するためのステート

  useEffect(() => {
    // リスナーを登録して、認証状態の変化を監視

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('サインインしています:', user);
        setUser(user);
        if (user.emailVerified) {
          setAuthState(Status.SIGNED_IN);
        } else {
          setAuthState(Status.NEED_EMAIL_VERIFICATION);
        }
      } else {
        console.log('サインアウトしています');
        setUser(null);
        setAuthState(Status.SIGNED_OUT);
      }
    });

    // コンポーネントのアンマウント時にリスナーを解除してメモリリークを防止する
    return () => unsubscribe();
  }, []);

  // 必要があれば他の処理をここに追加

  useEffect(() => {
    // 必要があれば他の処理をここで実行
    switch (authState) {
      case Status.SIGNED_IN:
        navigation.reset({
          index: 0,
          routes: [{ name: "HomeNavigator" }],
        });
        break;
      case Status.NEED_EMAIL_VERIFICATION:
        navigation.reset({
          index: 0,
          routes: [{ name: "LoginOrSignUpScreen" }],
        });
        console.log("メールアドレスの確認が必要です。");
        break;
      case Status.SIGNED_OUT:
        navigation.reset({
          index: 0,
          routes: [{ name: "LoginOrSignUpScreen" }],
        });
        break;
    }
  }, [user, authState, navigation]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text>読み込み中...</Text>
    </View>
  );
};

export default LoadingScreen;

