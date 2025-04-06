import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { db } from "../../../004BackendModules/firebaseMetod/firebase"; 
import { collection, addDoc, Timestamp } from "firebase/firestore";

const FreemarketInput = () => {
  const [itemName, setItemName] = useState(""); // 商品名
  const [itemDescription, setItemDescription] = useState(""); // 商品の説明
  const [images, setImages] = useState([]); // 写真
  const [itemCondition, setItemCondition] = useState(""); // 商品の状態

  const conditions = [
    "未使用",
    "ほぼ未使用",
    "目立った汚れなし",
    "やや汚れ傷あり",
    "全体的に状態が悪い",
  ];

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      if (result.assets.length + images.length > 4) {
        Alert.alert("エラー", "写真は最大4枚まで選択できます。");
        return;
      }
      setImages([...images, ...result.assets.map((asset) => asset.uri)]);
    }
  };

  const handleSubmit = async () => {
    if (!itemName || !itemDescription || !itemCondition || images.length === 0) {
      Alert.alert("エラー", "すべての項目を入力してください。");
      return;
    }

    try {
      const freemarketCollection = collection(db, "freemarketItems");
      await addDoc(freemarketCollection, {
        itemName,
        itemDescription,
        images,
        itemCondition,
        createdAt: Timestamp.now(),
      });

      Alert.alert("成功", "商品を登録しました！");
      setItemName("");
      setItemDescription("");
      setImages([]);
      setItemCondition("");
    } catch (error) {
      console.error("商品の登録中にエラーが発生しました:", error);
      Alert.alert("エラー", "商品の登録に失敗しました。");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>フリーマーケット商品登録</Text>

      {/* 商品名 */}
      <TextInput
        style={styles.input}
        placeholder="商品名を入力"
        value={itemName}
        onChangeText={setItemName}
      />

      {/* 商品の説明 */}
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="商品の説明を入力"
        value={itemDescription}
        onChangeText={setItemDescription}
        multiline
      />

      {/* 写真 */}
      <TouchableOpacity style={styles.imageButton} onPress={handleImagePick}>
        <Text style={styles.imageButtonText}>写真を選択 (最大4枚)</Text>
      </TouchableOpacity>
      <View style={styles.imagePreviewContainer}>
        {images.map((uri, index) => (
          <Image key={index} source={{ uri }} style={styles.imagePreview} />
        ))}
      </View>

      {/* 商品の状態 */}
      <Text style={styles.label}>商品の状態</Text>
      <View style={styles.conditionContainer}>
        {conditions.map((condition) => (
          <TouchableOpacity
            key={condition}
            style={[
              styles.conditionButton,
              itemCondition === condition && styles.activeConditionButton,
            ]}
            onPress={() => setItemCondition(condition)}
          >
            <Text
              style={[
                styles.conditionButtonText,
                itemCondition === condition && styles.activeConditionButtonText,
              ]}
            >
              {condition}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 登録ボタン */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>登録</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 80,
  },
  imageButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  imageButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  imagePreviewContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  imagePreview: {
    width: 80,
    height: 80,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  conditionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  conditionButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginRight: 8,
    marginBottom: 8,
  },
  activeConditionButton: {
    backgroundColor: "#4CAF50",
  },
  conditionButtonText: {
    fontSize: 14,
    color: "#6b7280",
  },
  activeConditionButtonText: {
    color: "#fff",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default FreemarketInput;