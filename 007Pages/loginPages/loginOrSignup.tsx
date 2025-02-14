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
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { auth } from "../../004BackendModules/messageMetod/firebase";
import { useNavigation } from "@react-navigation/native";


export default function LoginOrSignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation(); // ホーム画面への遷移に使用

  // 永続化をbrowserLocalPersistenceで設定
  // 案：https://github.com/react-native-jp/praiser/blob/9962c9c11e4fedfccdb9571d9289d78b1dbeb747/src/lib/local-store/user-information.ts
  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      console.log("Persistence set to local.");
    })
    .catch((error) => {
      console.error("Error setting persistence:", error);
    });

  const LoginWithEmail = (email: string, password: string) => {
    // if (!email.endsWith("s.thers.ac.jp")) {
    //   Alert.alert(
    //     "エラー",
    //     "メールアドレスは s.thers.ac.jp で終わる必要があります"
    //   );
    //   return;
    // }
    //今は無条件でホーム画面へ遷移できる
    navigation.navigate("Home");

  //   signInWithEmailAndPassword(auth, email, password)
  //     .then((userCredential) => {
  //       // サインイン成功
  //       console.log("User signed in:", userCredential.user);
  //       navigation.navigate("Home"); // ホーム画面に遷移
  //     })
  //     .catch((error) => {
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //       console.error("Error signing in:", errorCode, errorMessage);
  //       Alert.alert("ログインエラー", errorMessage);
  //     });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>ログイン</Text>
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
      <Button
        title="ログイン"
        onPress={() => LoginWithEmail(email, password)}
      />
      <Button
        title="新規登録"
        onPress={() => navigation.navigate("SignUpScreen")} // 新規登録画面に遷移
      />
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
