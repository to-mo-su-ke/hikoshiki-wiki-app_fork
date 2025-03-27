/*
作成したファイルは以下の通りです
backend
|submitPersonalInformation
pages
|signupOrLogin
|signUp1
|signUp2
|selectClub
routes
|signUpRouting

メールアドレスとパスワードを入力する画面です
名前にログインと入っていますがまだログイン機能は追加していません

*/
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Alert,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
} from "firebase/auth";



export default function SignUpScreen({ navigation }) { //分割代入
  

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 永続化をbrowserLocalPersistenceで設定　ともすけの環境ではうまくいかなかったので一時的にコメントアウトしています
  // setPersistence(auth, browserLocalPersistence)
  //   .then(() => {
  //     console.log("Persistence set to local.");
  //   })
  //   .catch((error) => {
  //     console.error("Error setting persistence:", error);
  //   });

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
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>新規登録</Text>
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
      {/* 認証ボタン */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "green" }]}
        onPress={() => InputEmailAndPasswordScreen(email, password)}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>認証</Text>
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
    marginBottom: 24,
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
    marginTop: 8,
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
});