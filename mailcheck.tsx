//どこに置けばいいのかわからないのでとりあえず1番上に置いておきます。画面遷移担当の方は勝手に動かしてもらって大丈夫です。

import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  Alert,
  Text,
  SafeAreaView,
} from "react-native";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./lib/firebase"; // これが正しく設定されていることを確認
import InputScreen from "./pages/InputScreen";

// Firebaseアプリの初期化
const app = initializeApp(firebaseConfig); //バグったら初回時のみ初期化するようにして関数内に入れる
const auth = getAuth(app);


export default function InputPersonalInformationScreen({ route }) {
    const email = route.params.email;
    const password = route.params.password;
  // const navigation = useNavigation(); // ホーム画面への遷移に使用

  // 永続化をbrowserLocalPersistenceで設定
  // setPersistence(auth, browserLocalPersistence)
  //   .then(() => {
  //     console.log("Persistence set to local.");
  //   })
  //   .catch((error) => {
  //     console.error("Error setting persistence:", error);
  //   });

  const SignUpWithEmail = (email: string, password: string) => {

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // サインアップ成功
        console.log("User signed up:", userCredential.user);
        // navigation.navigate(""); // ホーム画面に遷移
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error signing up:", errorCode, errorMessage);
        Alert.alert("サインアップエラー", errorMessage);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>新規登録</Text>
      <InputScreen/>
      {/* <TextInput
        style={styles.input}
        placeholder="メールアドレス"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="パスワード"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        placeholderTextColor="#aaa"
      />
      <Button
        title="認証" //個人情報入力画面へ
        onPress={() => SignUpWithEmail(email, password)}
      /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
});
