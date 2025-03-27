import React, { useState } from "react";
import { View, Text, Button, Alert, ScrollView, Image, StyleSheet, ActivityIndicator } from "react-native";
import { submitDataToFirestore } from "../../004BackendModules/mainMethod/submitdata";

const ClubRecruitmentConfirm = ({ route, navigation }) => {
  const { formData } = route.params || { formData: {} };
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 日本語の項目名マッピング
  const labelMapping = {
    clubName: "サークル名",
    contactInfo: "連絡先情報",
    lineQRCode: "LINE QRコード",
    content: "活動内容",
    recruitmentDetails: "求める人材",
  };

  // 連絡先情報の項目名マッピング
  const contactLabelMapping = {
    discord: "Discord",
    twitter: "Twitter",
    instagram: "Instagram",
    line: "LINE",
    web: "Webサイト",
  };

  // フォームデータのバリデーション
  const validateFormData = () => {
    if (!formData) return false;
    if (!formData.clubName || formData.clubName.trim() === "") {
      Alert.alert("エラー", "サークル名は必須項目です");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateFormData()) return;
    
    try {
      setIsSubmitting(true);
      
      // サブミット用のデータを準備
      const submitData = {
        ...formData,
        createdAt: new Date(),
      };
      
      await submitDataToFirestore(submitData, "clubRecruitment");
      
      setIsSubmitting(false);
      Alert.alert("送信完了", "メンバー募集情報が送信されました", [
        { text: "OK", onPress: () => navigation.navigate("Home") }
      ]);
    } catch (error) {
      setIsSubmitting(false);
      console.error("送信エラー：", error);
      Alert.alert("エラー", `送信に失敗しました: ${error.message || "不明なエラー"}`);
    }
  };

  // オブジェクトデータを表示する関数
  const renderObjectData = (data, labelMap) => {
    if (!data || Object.keys(data).length === 0) return <Text style={styles.itemValue}>未入力</Text>;
    
    return (
      <View style={styles.nestedContainer}>
        {Object.entries(data).map(([key, value]) => (
          <View key={key} style={styles.nestedItem}>
            <Text style={styles.nestedLabel}>{labelMap[key] || key}:</Text>
            <Text style={styles.nestedValue}>{value ? String(value) : "未入力"}</Text>
          </View>
        ))}
      </View>
    );
  };

  // QRコード画像を安全に表示する関数
  const renderQRCode = () => {
    if (!formData.lineQRCode) {
      return <Text style={styles.sectionValue}>未入力</Text>;
    }
    
    return (
      <View style={styles.qrContainer}>
        <Image 
          source={{ uri: formData.lineQRCode }} 
          style={styles.qrImage} 
          onError={(e) => console.error("画像読み込みエラー:", e.nativeEvent.error)}
          // defaultSource={require('../../assets/default-qr-placeholder.png')} // デフォルト画像をアセットに追加する必要あり
        />
      </View>
    );
  };

  if (!formData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>データの読み込みに失敗しました</Text>
        <Button title="戻る" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>入力内容の確認</Text>
      
      {/* サークル名 */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>{labelMapping.clubName}:</Text>
        <Text style={styles.sectionValue}>{formData.clubName || "未入力"}</Text>
      </View>
      
      {/* 連絡先情報 */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>{labelMapping.contactInfo}:</Text>
        {renderObjectData(formData.contactInfo, contactLabelMapping)}
      </View>
      
      {/* LINE QRコード */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>{labelMapping.lineQRCode}:</Text>
        {renderQRCode()}
      </View>
      
      {/* 活動内容 */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>{labelMapping.content}:</Text>
        <Text style={styles.sectionValue}>{formData.content || "未入力"}</Text>
      </View>
      
      {/* 求める人材 */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>{labelMapping.recruitmentDetails}:</Text>
        <Text style={styles.sectionValue}>{formData.recruitmentDetails || "未入力"}</Text>
      </View>
      
      {/* 送信ボタン */}
      <View style={styles.buttonContainer}>
        {isSubmitting ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : (
          <Button
            title="送信する"
            onPress={handleSubmit}
            color="#4CAF50"
            disabled={isSubmitting}
          />
        )}
      </View>
      
      {/* 戻るボタン */}
      <View style={styles.buttonContainer}>
        <Button
          title="入力画面に戻る"
          onPress={() => navigation.goBack()}
          color="#9E9E9E"
          disabled={isSubmitting}
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
  section: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  sectionValue: {
    fontSize: 16,
    color: "#555",
    marginLeft: 8,
  },
  nestedContainer: {
    marginLeft: 8,
  },
  nestedItem: {
    flexDirection: "row",
    marginVertical: 4,
  },
  nestedLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    width: 100,
  },
  nestedValue: {
    fontSize: 14,
    color: "#555",
    flex: 1,
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  qrImage: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
  },
  buttonContainer: {
    marginVertical: 8,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 20,
  },
  itemValue: {
    fontSize: 14,
    color: "#555",
    marginLeft: 8,
  },
});

export default ClubRecruitmentConfirm;
