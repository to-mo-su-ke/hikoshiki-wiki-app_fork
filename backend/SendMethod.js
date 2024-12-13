import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { submitDataToFirestore } from "./index";
import { uploadImageToFirebase } from "./photoUploadMethods";

// データを送信するメソッド
export const handleSubmit = async (data, collectionName, requiredFields) => {
  for (const field of requiredFields) {
    if (!data[field]) {
      Alert.alert("全ての必須フィールドを入力してください");
      return;
    }
  }

  await submitDataToFirestore(data, collectionName);
  Alert.alert("送信が完了しました");
};

// 画像をアップロードするメソッド
export const handleUpload = async (selectedImages) => {
  if (selectedImages.length === 0) {
    Alert.alert("画像が選択されていません");
    return null;
  }

  try {
    const urls = await Promise.all(selectedImages.map(uri => uploadImageToFirebase(uri)));
    Alert.alert("画像がアップロードされました: " + urls.join(", "));
    return urls;
  } catch (error) {
    Alert.alert("アップロード中にエラーが発生しました: " + error.message);
    return null;
  }
};

// 画像を選択するメソッド
export const pickImage = async (index, selectedImages, setSelectedImages) => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.canceled) {
    const newImages = [...selectedImages];
    newImages[index] = result.assets[0].uri;
    setSelectedImages(newImages);
  }
};

// フォームを送信するメソッド
export const handleFormSubmit = async (clubName, selectedImages) => {
  const requiredFields = ["clubName", "image1", "image2"];
  const data = {
    clubName,
    image1: selectedImages[0],
    image2: selectedImages[1],
  };

  // 画像をアップロード
  const imageUrls = await handleUpload(selectedImages);
  if (!imageUrls) return;

  // 画像URLをデータに追加
  data.image1 = imageUrls[0];
  data.image2 = imageUrls[1];

  // データを送信
  await handleSubmit(data, "clubs", requiredFields);
};