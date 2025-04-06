import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { db } from "../../../004BackendModules/firebaseMetod/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

const ColumAdminist = ({ navigation }) => {
  const [title, setTitle] = useState(""); // コラムのタイトル
  const [link, setLink] = useState(""); // コラムのリンク
  const [date, setDate] = useState(""); // コラムの日付

  const handlePostColum = async () => {
    if (!title || !link || !date) {
      Alert.alert("エラー", "すべてのフィールドを入力してください。");
      return;
    }

    try {
      const columCollection = collection(db, "Colum");
      await addDoc(columCollection, {
        Title: title,
        Link: link,
        Date: Timestamp.fromDate(new Date(date)), // 日付をFirestoreのTimestamp形式に変換
      });

      Alert.alert("成功", "コラムを投稿しました！");
      setTitle("");
      setLink("");
      setDate("");
      navigation.goBack(); // 投稿後に前の画面に戻る
    } catch (error) {
      console.error("コラムの投稿中にエラーが発生しました:", error);
      Alert.alert("エラー", "コラムの投稿に失敗しました。");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>コラム投稿</Text>
      <TextInput
        style={styles.input}
        placeholder="タイトルを入力"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="リンクを入力"
        value={link}
        onChangeText={setLink}
      />
      <TextInput
        style={styles.input}
        placeholder="日付を入力 (例: 2025-04-01)"
        value={date}
        onChangeText={setDate}
      />
      <TouchableOpacity style={styles.button} onPress={handlePostColum}>
        <Text style={styles.buttonText}>投稿する</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ColumAdminist;