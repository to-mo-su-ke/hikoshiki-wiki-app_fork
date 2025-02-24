import React, { useState } from "react";
import { View, Text, Button, Alert, StyleSheet, ScrollView, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { uploadPhotoToFirestore } from "../../004BackendModules/mainMethod/uploadPhoto";
// 追加: submitDataToFirestore のインポート (clubmakeを参考)
import { submitDataToFirestore } from "../../004BackendModules/mainMethod/submitdata";

const InputScreen = () => {
  const [photoUri, setPhotoUri] = useState(null);

  // Expo ImagePicker を利用した写真選択処理
  const handleSelectPhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
      Alert.alert("写真が選択されました");
    } else {
      Alert.alert("画像選択がキャンセルされました");
    }
  };

  const handleSubmit = async () => {
    if (!photoUri) {
      Alert.alert("写真を選択してください");
      return;
    }

    try {
      const response = await fetch(photoUri);
      if (!response.ok) {
        throw new Error("Blob変換失敗: ステータス " + response.status);
      }
      const blob = await response.blob();

      let downloadUrl;
      try {
        downloadUrl = await uploadPhotoToFirestore(blob);
        if (!downloadUrl) {
          throw new Error("アップロード結果が空です");
        }
      } catch (uploadError) {
        console.error("写真アップロード中エラー:", uploadError);
        Alert.alert("写真アップロードに失敗しました: " + uploadError.message);
        return;
      }

      // 取得したリンクをデータベースコレクション "phototest" に送信
      const data = { photoUrl: downloadUrl, timestamp: new Date().toISOString() };
      await submitDataToFirestore(data, "phototest");
      Alert.alert("写真のアップロードと送信が完了しました", `URL: ${downloadUrl}`);
    } catch (error) {
      console.error("送信処理全体エラー:", error);
      Alert.alert("送信処理中にエラーが発生しました: " + error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>InputScreen</Text>
      <Button title="写真を選択" onPress={handleSelectPhoto} />
      {photoUri && (
        <Image
          source={{ uri: photoUri }}
          style={styles.imagePreview}
        />
      )}
      <Button title="送信" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginVertical: 10,
    alignSelf: "center",
  },
});

export default InputScreen;