import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  Alert,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import {
  getAuth,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import  SignInWithEmail  from "../../004BackendModules/loginMethod/signInWithEmail";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { setUserToken } from "../../010Redux/actions";

export default function LoginOrSignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation(); // ホーム画面への遷移に使用
  const dispatch = useDispatch();


  const LoginWithEmail = async (email: string, password: string) => {
    if (!email.endsWith("s.thers.ac.jp")) {
      Alert.alert(
        "メールアドレスは s.thers.ac.jp で終わる必要があります"
      );
      return;
    }

    try {
      const uid = await SignInWithEmail(email, password); // ログインに失敗した場合error.message:alert-displayed-errorがthrownされる
      dispatch(setUserToken(uid));
      navigation.navigate("HomeNavigator"); // ホーム画面に遷移
    } catch (error: any) {
      // エラーハンドリング
      switch (error.message) {
        case "alert-displayed-error":
          // すでにアラートが表示されているので何もしない
          break;
        default:
          // その他のエラー
          Alert.alert("ログインに失敗しました。");
          break;
      }    
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>ログイン</Text>
      <Text>メールはs.thers.ac.jpで終わる機構メールを使用してください</Text>
      <TextInput
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
      {/* ログインボタン */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "green" }]}
        onPress={() => LoginWithEmail(email, password)}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>ログイン</Text>
      </TouchableOpacity>

      {/* 新規登録ボタン */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "green" }]}
        onPress={() => navigation.navigate("SignUpScreen")}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>新規登録</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 85,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 36,
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
  button: {
    color: "#fff",
    height: 40,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});