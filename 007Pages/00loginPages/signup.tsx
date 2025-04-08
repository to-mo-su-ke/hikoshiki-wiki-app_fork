/*
メールアドレスとパスワードを入力するサインアップ画面です
ここでの入力情報は次のサインアップ画面に引き継がれます

ユーザー認証情報はFirebase Authenticationに保存されます
ユーザー情報についてのfirestoreのデータ構造

firestore
|--user(コレクション)
|  |--{uid}(ドキュメント)
|  |  |  以下はフィールド
|  |  |--username
|  |  |--grade
|  |  |--school
|  |  |--department
|  |  |--course
|  |  |--major
|  |  |--researchroom
|  |  |--role
|  |  |--club
*/

import React, { useState } from "react";
import {
  View,
  TextInput,
  Alert,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { commonAuthStyles, signupStyles } from "../../002Styles/loginstyle";

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const InputEmailAndPasswordScreen = (email: string, password: string) => {
    if (!email.endsWith("s.thers.ac.jp")) {
      Alert.alert(
        "エラー",
        "メールアドレスは s.thers.ac.jp で終わる必要があります"
      );
      return;
    }
    //パスワードの条件を追加する
    
    navigation.navigate("InputPersonalInformationScreen1", { email, password });
  };

  return (
    <SafeAreaView style={signupStyles.container}>
      <Text style={commonAuthStyles.title}>新規登録</Text>
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
      {/* 認証ボタン */}
      <TouchableOpacity
        style={[commonAuthStyles.button, { backgroundColor: "green" }]}
        onPress={() => InputEmailAndPasswordScreen(email, password)}
        activeOpacity={0.7}
      >
        <Text style={commonAuthStyles.buttonText}>認証</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}