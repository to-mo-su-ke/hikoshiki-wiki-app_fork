// パスワード再設定用のメールを送信する画面

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
import { useNavigation } from "@react-navigation/native";
import { authContext } from "../../011Context/authContext";
import sendPasswordReset from "../../004BackendModules/loginMethod/sendPasswordResetEmail";


export default function SendPasswordResetEmailScreen() {
  const [email, setEmail] = useState("");
  const navigation = useNavigation(); // ホーム画面への遷移に使用
  const { authState } = React.useContext(authContext);

  const sendEmail = async (email: string) => {
    if (!email.endsWith("s.thers.ac.jp")) {
      Alert.alert(
        "エラー",
        "メールアドレスは s.thers.ac.jp で終わる必要があります"
      );
      return;
    }

    try {
      await sendPasswordReset(email);
      navigation.reset({
        index: 0,
        routes: [{ name: "LoadingScreen" }],
      })
    } catch (error: any) {
      Alert.alert("メールが送信できませんでした。");
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>パスワード再設定</Text>
      <Text style={styles.infoText}>パスワードを再設定するためのメールを送信します。メール上のリンクからパスワードを再設定してください。</Text>
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
      {/* パスワード再設定用メール送信ボタン */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "green" }]}
        onPress={() => sendEmail(email)}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>メール送信</Text>
      </TouchableOpacity>

      <Text style={styles.infoText}>メール送信後タイトル画面に戻ります。</Text>
      <Text style={styles.infoText}>メールが届かない場合は、迷惑メールフォルダを確認してください。</Text>
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