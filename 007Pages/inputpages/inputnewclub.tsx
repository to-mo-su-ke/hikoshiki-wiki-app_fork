import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  StyleSheet, 
  ScrollView, 
  Alert, 
  Image, 
  TouchableOpacity 
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { submitDataToFirestore } from "../../004BackendModules/mainMethod/submitdata";

const InputNewClub = ({ navigation }) => {
  const [formData, setFormData] = useState({
    clubName: "", // サークル名
    contactInfo: {
      discord: "",
      twitter: "",
      instagram: "",
      line: "",
      web: "",
    },
    lineQRCode: null, // LINE QRコードの画像URL
    content: "", // 内容
    recruitmentDetails: "", // 求める人材
  });

  // テキスト入力の更新
  const handleTextChange = (field, value) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: value
    }));
  };

  // 連絡先情報の更新
  const handleContactChange = (field, value) => {
    setFormData(prevState => ({
      ...prevState,
      contactInfo: {
        ...prevState.contactInfo,
        [field]: value
      }
    }));
  };

  // 画像選択処理
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== "granted") {
      Alert.alert("権限エラー", "画像へのアクセス権限が必要です");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setFormData(prevState => ({
        ...prevState,
        lineQRCode: result.assets[0].uri
      }));
    }
  };

  // 確認画面へ進む
  const handleConfirm = () => {
    // 必須項目の検証
    if (!formData.clubName.trim()) {
      Alert.alert("エラー", "サークル名は必須です");
      return;
    }

    navigation.navigate("ClubRecruitmentConfirm", { formData });
  };

  // 送信処理
  const handleSubmit = async () => {
    try {
      // 必須項目の検証
      if (!formData.clubName.trim()) {
        Alert.alert("エラー", "サークル名は必須です");
        return;
      }

      // Firestoreに送信
      await submitDataToFirestore(formData, "clubRecruitment");
      Alert.alert("送信完了", "メンバー募集情報が送信されました", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error("送信エラー：", error);
      Alert.alert("エラー", "送信に失敗しました");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>メンバー募集情報入力</Text>
      
      {/* サークル名 */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>サークル名 <Text style={styles.required}>*必須</Text></Text>
        <TextInput
          style={styles.input}
          value={formData.clubName}
          onChangeText={(text) => handleTextChange("clubName", text)}
          placeholder="サークル名を入力してください"
        />
      </View>
      
      {/* 連絡先情報 */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>連絡先</Text>
        
        <Text style={styles.subLabel}>Discord</Text>
        <TextInput
          style={styles.input}
          value={formData.contactInfo.discord}
          onChangeText={(text) => handleContactChange("discord", text)}
          placeholder="Discord URL"
        />
        
        <Text style={styles.subLabel}>Twitter</Text>
        <TextInput
          style={styles.input}
          value={formData.contactInfo.twitter}
          onChangeText={(text) => handleContactChange("twitter", text)}
          placeholder="Twitter ID/URL"
        />
        
        <Text style={styles.subLabel}>Instagram</Text>
        <TextInput
          style={styles.input}
          value={formData.contactInfo.instagram}
          onChangeText={(text) => handleContactChange("instagram", text)}
          placeholder="Instagram ID/URL"
        />
        
        <Text style={styles.subLabel}>LINE</Text>
        <TextInput
          style={styles.input}
          value={formData.contactInfo.line}
          onChangeText={(text) => handleContactChange("line", text)}
          placeholder="LINE ID"
        />
        
        <Text style={styles.subLabel}>Webサイト</Text>
        <TextInput
          style={styles.input}
          value={formData.contactInfo.web}
          onChangeText={(text) => handleContactChange("web", text)}
          placeholder="WebサイトURL"
        />
        
        <Text style={styles.subLabel}>LINE QRコード</Text>
        <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
          <Text style={styles.imagePickerButtonText}>QRコード画像を選択</Text>
        </TouchableOpacity>
        {formData.lineQRCode && (
          <Image source={{ uri: formData.lineQRCode }} style={styles.qrImage} />
        )}
      </View>
      
      {/* 内容 */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>活動内容</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.content}
          onChangeText={(text) => handleTextChange("content", text)}
          placeholder="サークルの活動内容について詳しく記入してください"
          multiline={true}
          numberOfLines={6}
        />
      </View>
      
      {/* 求める人材 */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>求める人材</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.recruitmentDetails}
          onChangeText={(text) => handleTextChange("recruitmentDetails", text)}
          placeholder="どのような人を求めているか記入してください"
          multiline={true}
          numberOfLines={6}
        />
      </View>

      {/* 送信ボタン */}
      <View style={styles.buttonContainer}>
        <Button
          title="送信する"
          onPress={handleSubmit}
          color="#4CAF50"
        />
      </View>

      {/* 確認画面ボタン */}
      <View style={styles.buttonContainer}>
        <Button
          title="入力内容を確認する"
          onPress={handleConfirm}
          color="#2196F3"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#333",
  },
  inputGroup: {
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  subLabel: {
    fontSize: 14,
    marginTop: 8,
    marginBottom: 4,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  imagePickerButton: {
    backgroundColor: "#e0e0e0",
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
    marginVertical: 8,
  },
  imagePickerButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
  qrImage: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginVertical: 10,
    resizeMode: "contain",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
  },
  buttonContainer: {
    marginVertical: 10,
  },
  required: {
    color: "red",
    fontSize: 14,
  },
});

export default InputNewClub;
