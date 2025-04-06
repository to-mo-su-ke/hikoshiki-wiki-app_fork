import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
    Button,
    Image,
    SafeAreaView,
    
} from "react-native";
import { Dropdown } from "react-native-paper-dropdown";
import { getAuth } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../006Configs/firebaseConfig2";

const GradeInfo = (navigation) => {
  const [selectedDepartment, setSelectedDepartment] = useState(""); // 初期値を空文字列に設定
  const [gpa, setGpa] = useState("");
  const [specializedGpa, setSpecializedGpa] = useState("");

  // 学科データ (signUp1.tsxから参照)
  const departmentData = [
    { label: "人文学科", value: "humanities" },
    { label: "人間発達科学科", value: "humanDevelopment" },
    { label: "法律・政治学科", value: "lawPolitics" },
    { label: "経済学科", value: "economicScience" },
    { label: "経営学科", value: "management" },
    { label: "自然情報学科", value: "naturalInformatics" },
    { label: "人間・社会情報学科", value: "humanSocialInformatics" },
    { label: "コンピュータ科学科", value: "computerScience" },
    { label: "学科配属前", value: "unaffiliated" },
    { label: "数理学科", value: "mathematics" },
    { label: "物理学科", value: "physics" },
    { label: "化学科", value: "chemistry" },
    { label: "生命理学科", value: "biologicalScience" },
    { label: "地球惑星科学科", value: "earthPlanetarySciences" },
    { label: "医学科", value: "medicalScience" },
    { label: "保健学科", value: "healthSciences" },
    { label: "化学生命工学科", value: "chemicalBiologicalEngineering" },
    { label: "物理工学科", value: "physicalScience" },
    { label: "マテリアル工学科", value: "materials" },
    { label: "電気電子情報工学科", value: "electricalElectronicInfo" },
    { label: "機械・航空宇宙工学科", value: "mechanicalAerospace" },
    { label: "エネルギー理工学科", value: "energyEngineering" },
    { label: "環境土木・建築学科", value: "civilArchitecture" },
    { label: "生物環境科学科", value: "bioenvironmentalScience" },
    { label: "資源生物科学科", value: "bioresourceScience" },
    { label: "応用生命科学科", value: "appliedBioscience" },
  ];

  // Firestoreに成績情報を保存
  const handleSave = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        Alert.alert("エラー", "ログインしていません");
        return;
      }

      const uid = currentUser.uid;
      const userDocRef = doc(db, "user", uid);

      await updateDoc(userDocRef, {
        department: selectedDepartment,
        gpa: gpa,
        specializedGpa: specializedGpa,
      });

      Alert.alert("成功", "成績情報が保存されました");
    } catch (error) {
      console.error("Error saving grade info:", error);
      Alert.alert("エラー", "成績情報の保存に失敗しました");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>成績管理</Text>

      {/* 志望学科等変更 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>志望コース等変更</Text>
        <Text style={styles.label}>1. 志望学科</Text>
        <Dropdown
          label="志望学科"
          placeholder="学科を選択してください"
          options={departmentData} // 修正: data -> options
          value={selectedDepartment}
        //   onChangeText={(value) => setSelectedDepartment(value)} // 修正: onChange -> onChangeText
        />
      </View>

      {/* 現在成績 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>現在成績</Text>
        <Text style={styles.label}>1. GPA</Text>
        <TextInput
          style={styles.input}
          placeholder="GPAを入力してください"
          value={gpa}
          onChangeText={setGpa}
          keyboardType="numeric"
        />
        <Text style={styles.label}>2. 専門科目GPA</Text>
        <TextInput
          style={styles.input}
          placeholder="専門科目GPAを入力してください"
          value={specializedGpa}
          onChangeText={setSpecializedGpa}
          keyboardType="numeric"
        />
      </View>

      {/* 保存ボタン */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>保存する</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#1e3a8a",
  },
  section: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#334155",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    color: "#475569",
  },
  input: {
    height: 40,
    borderColor: "#e2e8f0",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: "#ffffff",
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default GradeInfo;