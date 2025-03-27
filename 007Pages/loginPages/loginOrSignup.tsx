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
      navigation.navigate("HomeNavi"); // ホーム画面に遷移
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
      <Text style={styles.infoText}>メールはs.thers.ac.jpで終わる機構メールを使用してください</Text>
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
    paddingHorizontal: 24,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#1e3a8a",
  },
  input: {
    height: 50,
    borderColor: "#e2e8f0",
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  button: {
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  infoText: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 16,
    textAlign: "center",
  }
});