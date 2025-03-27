import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useDispatch } from "react-redux";
import { removeCourse } from "../../010Redux/actions";

const CourseDetailView = ({ route, navigation }) => {
  const { course, day, period, termDayPeriod, degree } = route.params;
  const dispatch = useDispatch();

  if (!course) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>コース情報が見つかりません</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>戻る</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      "削除の確認",
      "この授業を時間割から削除しますか？",
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "削除",
          style: "destructive",
          onPress: () => {
            // courseTypeの判断が必要なので、ここではデフォルトで0とします
            // 実際の実装では、courseTypeも保存して利用する必要があります
            dispatch(
              removeCourse(degree, termDayPeriod, day, period, 0)
            );
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{course.courseTitle || course.title}</Text>
        <Text style={styles.subtitle}>
          {day}曜{period}限 - {course.credits || "0"}単位
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>担当教員</Text>
        <Text style={styles.sectionContent}>{course.instructor || "情報なし"}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>開講学部</Text>
        <Text style={styles.sectionContent}>{course.faculty || "情報なし"}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>授業形態</Text>
        <Text style={styles.sectionContent}>{course.classFormat || "情報なし"}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>授業概要</Text>
        <Text style={styles.sectionContent}>{course.description || "情報なし"}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>成績評価方法</Text>
        <Text style={styles.sectionContent}>{course.evaluationMethod || "情報なし"}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>時間割から削除</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  header: {
    marginBottom: 24,
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1e3a8a",
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
  },
  section: {
    marginBottom: 20,
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#334155",
  },
  sectionContent: {
    fontSize: 14,
    lineHeight: 22,
    color: "#475569",
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#dc2626",
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 40,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CourseDetailView;
