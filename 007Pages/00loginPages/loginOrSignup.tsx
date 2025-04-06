/*
ログインと新規登録への分岐画面です
メールアドレスとパスワードを使用したログイン機能を提供します

ユーザー認証にはFirebase Authenticationを使用します
ログイン成功時にはユーザーIDをReduxストアに保存します

firestore
|--user(コレクション)
|  |--{uid}(ドキュメント)
|  |  |  ログイン後にこのデータにアクセスします
*/

import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Alert,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { setUserToken } from "../../010Redux/actions";
import SignInWithEmail from "../../004BackendModules/loginMethod/signInWithEmail";
import { commonAuthStyles, loginOrSignupStyles } from "../../002Styles/loginstyle";

type RootStackParamList = {
  HomeNavigator: undefined;
  SignUpScreen: undefined;
};

export default function LoginOrSignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation<any>(); 
  const dispatch = useDispatch();

  const LoginWithEmail = async (email: string, password: string) => {
    if (!email.endsWith("s.thers.ac.jp")) {
      Alert.alert(
        "エラー",
        "メールアドレスは s.thers.ac.jp で終わる必要があります"
      );
      return;
    }

    try {
      const uid = await SignInWithEmail(email, password);
      dispatch(setUserToken(uid));
      navigation.reset({
        index: 0,
        routes: [{ name: "HomeNavigator" }],
      })
    } catch (error: unknown) {
      const err = error as { message: string };
      if (err.message === "alert-displayed-error") {
        return;
      } else {
        Alert.alert("ログインエラー", err.message);
      }
    }
  };

  return (
    <SafeAreaView style={loginOrSignupStyles.container}>
      <Text style={commonAuthStyles.title}>ログイン</Text>
      <Text style={commonAuthStyles.infoText}>メールはs.thers.ac.jpで終わる機構メールを使用してください</Text>
      <TextInput
        style={commonAuthStyles.input}
        placeholder="メールアドレス"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={commonAuthStyles.input}
        placeholder="パスワード"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        placeholderTextColor="#aaa"
      />
      {/* ログインボタン */}
      <TouchableOpacity
        style={[commonAuthStyles.button, { backgroundColor: "green" }]}
        onPress={() => LoginWithEmail(email, password)}
        activeOpacity={0.7}
      >
        <Text style={commonAuthStyles.buttonText}>ログイン</Text>
      </TouchableOpacity>

      {/* 新規登録ボタン */}
      <TouchableOpacity
        style={[commonAuthStyles.button, { backgroundColor: "green" }]}
        onPress={() => navigation.navigate("SignUpScreen")}
        activeOpacity={0.7}
      >
        <Text style={commonAuthStyles.buttonText}>新規登録</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}