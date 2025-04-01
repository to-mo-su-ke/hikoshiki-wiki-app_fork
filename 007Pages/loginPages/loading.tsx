// ローディング画面
// 認証状態を確認中に表示する画面

import React, { useState, useEffect, use } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { auth } from "../../004BackendModules/messageMetod/firebase";
import { onAuthStateChanged } from 'firebase/auth';
import { creatInitialAuthState, State, authContext } from "../../011Context/authContext";


const LoadingScreen = ({ navigation }) => {
  const [user, setUser] = useState(null); //後でnullに直す
  const { authState, setAuthState } = React.useContext(authContext); 
  useEffect(() => {
    setAuthState(creatInitialAuthState());
    // リスナーを登録して、認証状態の変化を監視

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('サインインしています:', user);
        setUser(user);
        if (user.emailVerified) {
          setAuthState(State.SIGNED_IN);
        } else {
          setAuthState(State.NEED_EMAIL_VERIFICATION);
        }
      } else {
        console.log('サインアウトしています');
        setUser(null);
        setAuthState(State.SIGNED_OUT);
      }
    });

    // コンポーネントのアンマウント時にリスナーを解除してメモリリークを防止する
    return () => unsubscribe();
  }, []);

  // 必要があれば他の処理をここに追加

  useEffect(() => {
    // 必要があれば他の処理をここで実行
    switch (authState) {
      case State.SIGNED_IN:
        navigation.reset({
          index: 0,
          routes: [{ name: "HomeNavigator" }],
        });
        break;
      case State.NEED_EMAIL_VERIFICATION:
        navigation.reset({
          index: 0,
          routes: [{ name: "LoginOrSignUpScreen" }],
        });
        console.log("メールアドレスの確認が必要です。");
        break;
      case State.SIGNED_OUT:
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

