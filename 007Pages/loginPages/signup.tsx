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
    paddingHorizontal: 85,
    backgroundColor: "#fff",
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