import React from "react";
import { View, Text, FlatList, StyleSheet, Linking, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import { addCourse } from "../../../010Redux/actions";

const CourseDetail = ({ route, navigation }) => {
  
  const dispatch = useDispatch();
  const { course, day, period, termDayPeriod, degree } = route.params;

  const determineCourseType = () => {
    if (course.termDayPeriod.includes('１期')) return 1;
    if (course.termDayPeriod.includes('２期')) return 2;
    return 0;
  };

  const handleRegister = () => {
    const courseType = determineCourseType();
    dispatch(addCourse(
      degree,
      termDayPeriod,
      day,
      period,
      courseType,
      course.registrationCode
    ));
    navigation.navigate("TimeTable");
  };

  if (!course) {
    return (
      <View style={styles.container}>
        <Text>コース情報がありません</Text>
      </View>
    );
  }

  const openURL = (url) => {
    Linking.openURL(url);
  };

  const courseDetails = [
    { title: "学部・大学院区分/学科・専攻", content: `${course.undergradGraduate}/${course.subject}\n` },
    { title: "科目区分", content: course.courseCategory + "\n" },
    { title: "担当教員", content: course.instructor.replace(/\n/g, ' / ') + "\n" },
    { title: "必修・選択", content: course.requiredSelected + "\n" },
    { title: "単位数", content: course.credits + "\n" },
    { title: "対象学年", content: course.year + "\n" },
    { title: "開講期・開講時間帯", content: course.termDayPeriod + "\n" },
    { title: "授業形態", content: course.courseStyle + "\n" },
    { title: "授業の目的", content: course.goalsOfCourse + "\n" },
    { title: "授業の達成目標", content: course.objectivesOfTheCourse + "\n" },
    { title: "授業の内容", content: course.courseContent + "\n" },
    { title: "履修条件", content: course.coursePrerequisites + "\n" },
    { title: "関連する科目", content: course.relatedCourses + "\n" },
    { title: "成績評価の方法と基準", content: course.evaluationMethod + "\n" },
    { title: "不可(F)と欠席(W)の基準", content: course.failAbsentCriteria + "\n" },
    { title: "教科書", content: course.textbook + "\n" },
    { title: "参考書", content: course.referenceBook + "\n" },
    { title: "履修取り下げ制度", content: course.courseWithdrawal + "\n" },
    { title: "他学部生、他専攻生、他研究科生の受講の可否", content: course.attendancePropriety + "\n" },
    { title: "他学科聴講の条件", content: course.otherDeptAttendanceConditions + "\n" },
    { title: "時間割コード", content: course.registrationCode + "\n" },
    { title: "シラバスURL (必ず確認してください)", content: course.syllabusUrl + "\n", isLink: true },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={courseDetails}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={<Text style={styles.title}>{course.courseTitle}</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.columnTitle}>{item.title}</Text>
            {item.isLink ? (
              <Text
                style={styles.columnContentLink}
                onPress={() => openURL(item.content)}
              >
                {item.content}
              </Text>
            ) : (
              <Text style={styles.columnContent}>{item.content}</Text>
            )}
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>履修する</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f8f9fa", 
    padding: 12,
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    color: "#1e3a8a",
    marginVertical: 16,
    paddingHorizontal: 12,
  },
  row: { 
    paddingHorizontal: 16, 
    paddingVertical: 8,
    backgroundColor: "#ffffff",
    marginBottom: 2,
    borderRadius: 8,
  },
  columnTitle: { 
    fontWeight: "600", 
    fontSize: 14, 
    marginTop: 5,
    color: "#334155", 
  },
  columnContent: { 
    fontSize: 14, 
    marginTop: 5,
    lineHeight: 20,
    color: "#475569",
    marginBottom: 4, 
  },
  columnContentLink: {
    fontSize: 14,
    color: "#3b82f6",
    marginTop: 5,
    textDecorationLine: "underline",
    marginBottom: 4,
  },
  separator: { 
    borderBottomWidth: 1, 
    borderColor: "#e2e8f0", 
    marginVertical: 8,
  },
  registerButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CourseDetail;