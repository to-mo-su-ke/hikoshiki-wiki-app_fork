import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../006Configs/firebaseConfig2";

const ClassReviewAdd = ({ navigation }) => {
  const [name, setName] = useState(""); // 授業名
  const [professor, setProfessor] = useState(""); // 教授名
  const [year, setYear] = useState("2025"); // 年度
  const [subject, setSubject] = useState(""); // 科目
  const [semester, setSemester] = useState("前期"); // 学期
  const [attendance, setAttendance] = useState("なし"); // 出欠
  const [evaluation, setEvaluation] = useState("テスト"); // 評価方法
  const [easeOfCredit, setEaseOfCredit] = useState("普通"); // 単位の取りやすさ
  const [content, setContent] = useState("普通"); // 内容
  const [comment, setComment] = useState(""); // コメント

  const handleSubmit = async () => {
    if (!name || !professor || !year || !semester || !attendance || !evaluation || !easeOfCredit || !content) {
      Alert.alert("エラー", "すべての項目を入力してください");
      return;
    }

    try {
      const reviewData = {
        name,
        professor,
        year,
        semester,
        subject,
        attendance,
        evaluation,
        easeOfCredit,
        content,
        comment,
        timestamp: new Date().toISOString(),
      };

      const reviewCollectionRef = collection(db, "classreview"); // コレクション名を指定
      await addDoc(reviewCollectionRef, reviewData);

      Alert.alert("投稿完了", "レビューが投稿されました");
      navigation.goBack(); // 前の画面に戻る
    } catch (error) {
      console.error("Error adding review: ", error);
      Alert.alert("エラー", "レビューの投稿に失敗しました");
    }
  };

  const renderButtonGroup = (label, options, selectedValue, setValue) => (
    <View style={styles.buttonGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.buttonRow}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              selectedValue === option && styles.selectedOptionButton,
            ]}
            onPress={() => setValue(option)}
          >
            <Text
              style={[
                styles.optionButtonText,
                selectedValue === option && styles.selectedOptionButtonText,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>授業名</Text>
      <TextInput
        style={styles.input}
        placeholder="授業名を入力"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>教授名</Text>
      <TextInput
        style={styles.input}
        placeholder="教授名を入力"
        value={professor}
        onChangeText={setProfessor}
      />

      {renderButtonGroup("年度", ["2025", "2024", "2023", "2022", "2021", "2020"], year, setYear)}
        {renderButtonGroup("科目", ["基礎セミナー", "英語", "外国語(英語以外)", "健康・スポーツ科学科目(実技)", "健康・スポーツ科学科目(講義)", "データ科学科目","国際理解科目","現代教養科目","超学部セミナー","人文,社会系基礎科目","自然系基礎科目","言語文化Ⅰ","言語文化Ⅱ","言語文化Ⅲ","文系基礎科目","理系基礎(文系)","理系基礎(理系)","文系教養科目","理系教養科目","全学教養科目","開放科目","専門科目","文学部専門科目","教育学部専門科目", "法学部専門科目", "経済学部専門科目","情報学部専門科目","情報文化学部専門科目","理学部専門科目","医学部専門科目","工学部専門科目","農学部専門科目","大学院","その他"], subject, setSubject)}
      {renderButtonGroup("学期", ["前期", "後期", "通年", "前期集中", "後期集中", "通年集中", "その他"], semester, setSemester)}
      {renderButtonGroup("出欠", ["なし", "時々", "毎回"], attendance, setAttendance)}
      {renderButtonGroup("評価方法", ["テスト", "レポート", "テスト+レポート", "その他"], evaluation, setEvaluation)}
      {renderButtonGroup("単位の取りやすさ", ["超簡単", "簡単", "普通", "難", "激難"], easeOfCredit, setEaseOfCredit)}
      {renderButtonGroup("内容", ["優秀", "良好", "普通", "不満", "劣悪"], content, setContent)}

      <Text style={styles.label}>コメント</Text>
      <TextInput
        style={[styles.input, styles.textArea]} 
        placeholder="コメントを入力 (任意)"
        value={comment}
        onChangeText={setComment}
        multiline
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>投稿する</Text>
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
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#334155",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  buttonGroup: {
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  optionButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    width: "30%", // 横幅を調整
  },
  selectedOptionButton: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  optionButtonText: {
    fontSize: 14,
    color: "#334155",
  },
  selectedOptionButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ClassReviewAdd;