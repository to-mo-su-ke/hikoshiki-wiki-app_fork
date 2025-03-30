// ローディング画面
// 認証状態を確認中に表示する画面

import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { auth } from "../../004BackendModules/messageMetod/firebase";
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigation } from "@react-navigation/native";


const LoadingScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // リスナーを登録して、認証状態の変化を監視
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('サインインしています:', user);
        setUser(user);
      } else {
        console.log('サインアウトしています');
        setUser(null);
      }
    });

    // コンポーネントのアンマウント時にリスナーを解除してメモリリークを防止する
    return () => unsubscribe();
  }, []);

  // 必要があれば他の処理をここに追加

  useEffect(() => {
    // 必要があれば他の処理をここで実行
    
    if (user) {
      // ユーザーがサインインしている場合、ホーム画面に遷移
      navigation.reset({
        index: 0,
        routes: [{ name: "HomeNavigator" }],
      })
    } else {
      // ユーザーがサインアウトしている場合、ログイン画面に遷移

      navigation.reset({
        index: 0,
        routes: [{ name: "LoginOrSignUpScreen" }],
      });
    } 
  }, [user, navigation]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text>読み込み中...</Text>
    </View>
  );
};

export default LoadingScreen;

