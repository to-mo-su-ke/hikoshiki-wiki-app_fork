// パスワード変更画面

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
import { changePassword } from "../../../004BackendModules/loginMethod/changePassword";
import { doSignOut } from "../../../004BackendModules/loginMethod/signOut";

export default function ChangePasswordScreen({ navigation }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  

  const HandleChangePassword = async () => {
    if (newPassword1 !== newPassword2) {
      Alert.alert("エラー", "新しいパスワードが一致しません。");
      return;
    }

    try {
      await changePassword(oldPassword, newPassword1);
      navigation.reset({
        index: 0,
        routes: [{ name: "HomeNavigator" }], // LoginNavigatorを指定するとサインアウト後にホーム画面に遷移するバグが起こる
      });
    } catch (error: any) {
        Alert.alert("エラー", error.message);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>パスワード変更</Text>
      <TextInput
        style={styles.input}
        placeholder="元のパスワード"
        value={oldPassword}
        onChangeText={setOldPassword}
        secureTextEntry
        autoCapitalize="none"
        placeholderTextColor="#aaa"
      />
        <TextInput
            style={styles.input}
            placeholder="新しいパスワード"
            value={newPassword1}
            onChangeText={setNewPassword1}
            secureTextEntry
            autoCapitalize="none"
            placeholderTextColor="#aaa"
        />
        <TextInput
            style={styles.input}
            placeholder="新しいパスワード（確認）"
            value={newPassword2}
            onChangeText={setNewPassword2}
            secureTextEntry
            autoCapitalize="none"
            placeholderTextColor="#aaa"
        />
      {/* パスワード変更ボタン */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "green" }]}
        onPress={HandleChangePassword}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>パスワード変更</Text>
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