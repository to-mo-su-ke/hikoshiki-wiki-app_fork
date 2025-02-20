import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import DropDownPicker from "react-native-dropdown-picker";
import app from "../../004BackendModules/messageMetod/firestore";

const ClassSelection = ({ route, navigation }) => {
  const { day, period, termDayPeriod, degree, department } = route.params || {};
  const [courses, setCourses] = useState([]);

  const db = getFirestore(app);

  const getTermInfo = (termDayPeriod) => {
    const year = Math.ceil(termDayPeriod / 2);
    const semester = termDayPeriod % 2 === 0 ? "秋" : "春";
    return { year, semester };
  };

  const [degreeOpen, setDegreeOpen] = useState(false);
  const [selectedDegree, setSelectedDegree] = useState(degree);
  const degrees = [
    { label: "全学教育科目", value: "学部" },
    { label: "文学部", value: "文学部" },
    { label: "教育学部", value: "教育学部" },
    { label: "法学部", value: "法学部" },
    { label: "経済学部", value: "経済学部" },
    { label: "情報学部", value: "情報学部" },
    { label: "理学部", value: "理学部" },
    { label: "工学部", value: "工学部" },
    { label: "農学部", value: "農学部" },
    { label: "医学部（保）", value: "医学部（保）" },
    { label: "人文・博前", value: "人文・博前" },
    { label: "人文・博後", value: "人文・博後" },
    { label: "教・博前", value: "教・博前" },
    { label: "法・博前", value: "法・博前" },
    { label: "法・博後", value: "法・博後" },
    { label: "法・専学", value: "法・専学" },
    { label: "経・博前", value: "経・博前" },
    { label: "情報・博前", value: "情報・博前" },
    { label: "情報・博後", value: "情報・博後" },
    { label: "理・博前", value: "理・博前" },
    { label: "理・博後", value: "理・博後" },
    { label: "多・博前", value: "多・博前" },
    { label: "工・博前", value: "工・博前" },
    { label: "工・博後", value: "工・博後" },
    { label: "農・博前", value: "農・博前" },
    { label: "農・博後", value: "農・博後" },
    { label: "医・博前", value: "医・博前" },
    { label: "医・博後", value: "医・博後" },
    { label: "開・博前", value: "開・博前" },
    { label: "環・博前", value: "環・博前" },
    { label: "創・博前", value: "創・博前" },
    { label: "創・博後", value: "創・博後" },
  ];

  const [departmentOpen, setDepartmentOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(department);
  const departments =
    selectedDegree === "工学部"
      ? [
          { label: "化学生命", value: "化学生命工学科" },
          { label: "物理工", value: "物理工学科" },
          { label: "マテリアル工", value: "マテリアル工学科" },
          { label: "電気電子情報工", value: "電気電子情報工学科" },
          { label: "機械・航空宇宙", value: "機械・航空宇宙工学科" },
          { label: "エネルギー理工", value: "エネルギー理工学科" },
          { label: "環境土木・建築", value: "環境土木・建築学科" },
        ]
      : selectedDegree === "理学部"
      ? [
          { label: "数理学科", value: "数理学科" },
          { label: "物理学科", value: "物理学科" },
          { label: "化学科", value: "化学科" },
          { label: "生命理学科", value: "生命理学科" },
          { label: "地球惑星科学科", value: "地球惑星科学科" },
        ]
      : [];

  const [termDayPeriodOpen, setTermDayPeriodOpen] = useState(false);
  const [selectedTermDayPeriod, setSelectedTermDayPeriod] =
    useState(termDayPeriod);
  const termDayPeriods = [
    { label: "１年 春", value: 1 },
    { label: "１年 秋", value: 2 },
    { label: "２年 春", value: 3 },
    { label: "２年 秋", value: 4 },
    { label: "３年 春", value: 5 },
    { label: "３年 秋", value: 6 },
    { label: "４年 春", value: 7 },
    { label: "４年 秋", value: 8 },
    { label: "５年 春", value: 9 },
    { label: "５年 秋", value: 10 },
    { label: "６年 春", value: 11 },
    { label: "６年 秋", value: 12 },
    { label: "７年 春", value: 13 },
    { label: "７年 秋", value: 14 },
    { label: "８年 春", value: 15 },
    { label: "８年 秋", value: 16 },
    { label: "９年 春", value: 17 },
    { label: "９年 秋", value: 18 },
    { label: "10年 春", value: 19 },
    { label: "10年 秋", value: 20 },
    { label: "11年 春", value: 21 },
    { label: "11年 秋", value: 22 },
    { label: "12年 春", value: 23 },
    { label: "12年 秋", value: 24 },
  ];

  const getPeriodString = (termDayPeriod) => {
    switch (termDayPeriod) {
      case 1:
        return "Ⅰ";
      case 2:
        return "Ⅱ";
      case 3:
        return "Ⅲ";
      case 4:
        return "Ⅳ";
      case 5:
        return "Ⅴ";
      case 6:
        return "Ⅵ";
      case 7:
        return "Ⅶ";
      case 8:
        return "Ⅷ";
      case termDayPeriod % 2 == 1:
        return "Ⅶ";
      case termDayPeriod % 2 == 0:
        return "Ⅷ";
      default:
        return "Ⅰ";
    }
  };

  const getNumber = (period) => {
    switch (period) {
      case 1:
        return "１";
      case 2:
        return "２";
      case 3:
        return "３";
      case 4:
        return "４";
      case 5:
        return "５";
      case 6:
        return "６";
      default:
        return "１";
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      const periodString = getPeriodString(selectedTermDayPeriod);
      const { year, semester } = getTermInfo(selectedTermDayPeriod);
      const number = getNumber(period);

      const q_termDayPeriod1 = `${periodString} ${day}曜日 ${number}`; // 例: Ⅰ 月曜日 １
      const q_termDayPeriod2 = `${periodString} その他 その他`; // 例: Ⅲ その他 その他
      const q_termDayPeriod3 = `${semester} ${day}曜日 ${number}`; // 例: 春 土曜日 ３
      const q_termDayPeriod4 = `${semester} その他 その他`; // 例: 春 その他 その他
      const q_termDayPeriod5 = `${semester}集中 その他 その他`; // 例: 春集中 その他 その他
      const q_termDayPeriod6 = `${semester}１期 ${day}曜日 ${number}`; // 例: 春１期 月曜日 １
      const q_termDayPeriod7 = `${semester}２期 ${day}曜日 ${number}`; // 例: 春２期 金曜日 １
      const q_termDayPeriod8 = `通年（春秋） ${day}曜日 ${number}`; // 例: 通年（春秋） 月曜日 １
      const q_termDayPeriod9 = `通年（秋春） ${day}曜日 ${number}`; // 例: 通年（秋春） 木曜日 ３
      const q_termDayPeriod10 = `通年集中（春秋） その他 その他`; // 例: 通年集中（春秋） その他 その他
      const q_termDayPeriod11 = `通年集中（秋春） その他 その他`; // 例: 通年集中（秋春） その他 その他

      let q_department = [];
      const filteredCoursesEngineering = [
        "化学生命工学科",
        "物理工学科",
        "マテリアル工学科",
        "電気電子情報工学科",
        "機械・航空宇宙工学科",
        "エネルギー理工学科",
        "環境土木・建築学科",
      ];
      const filteredCoursesScience = [
        "数理学科",
        "物理学科",
        "化学科",
        "生命理学科",
        "地球惑星科学科",
      ];
      if (selectedDepartment) {
        if (selectedDegree === "工学部") {
          q_department = filteredCoursesEngineering.filter(
            (item) => item !== selectedDepartment
          );
        } else if (selectedDegree === "理学部") {
          q_department = filteredCoursesScience.filter(
            (item) => item !== selectedDepartment
          );
        }
      }

      try {
        const q = query(
          collection(db, "syllabus"),
          where("undergradGraduate", "==", selectedDegree)
        );

        const querySnapshot = await getDocs(q);
        const coursesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const filteredCourses = coursesData.filter((course) => {
          const termDayPeriod = course.termDayPeriod || "";
          const department = course.subject || "";
          return (
            (termDayPeriod.includes(q_termDayPeriod1) ||
              termDayPeriod.includes(q_termDayPeriod2) ||
              termDayPeriod.includes(q_termDayPeriod3) ||
              termDayPeriod.includes(q_termDayPeriod4) ||
              termDayPeriod.includes(q_termDayPeriod5) ||
              termDayPeriod.includes(q_termDayPeriod6) ||
              termDayPeriod.includes(q_termDayPeriod7) ||
              termDayPeriod.includes(q_termDayPeriod8) ||
              termDayPeriod.includes(q_termDayPeriod9) ||
              termDayPeriod.includes(q_termDayPeriod10) ||
              termDayPeriod.includes(q_termDayPeriod11)) &&
            (q_department.length === 0 || !q_department.includes(department))
          );
        });

        setCourses(filteredCourses);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };

    fetchCourses();
  }, [day, period, selectedTermDayPeriod, selectedDegree, selectedDepartment]);

  const handleSelectCourse = (course) => {
    navigation.navigate("CourseDetail", { 
      course, 
      day,
      period,
      termDayPeriod, 
      degree
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerConstainer}>
        <View style={styles.headerLeft}>
          <View style={styles.degree}>
            <DropDownPicker
              open={degreeOpen}
              value={selectedDegree}
              items={degrees}
              setOpen={setDegreeOpen}
              setValue={(callback) => {
                const newDegree = callback(selectedDegree);
                setSelectedDegree(newDegree);
                setSelectedDepartment([]);
              }}
              placeholder="学部を選択"
              style={styles.degree}
              containerStyle={styles.label}
              dropDownContainerStyle={styles.drop}
            />
          </View>
          {departments.length > 0 && (
            <View style={styles.department}>
              <DropDownPicker
                open={departmentOpen}
                value={selectedDepartment}
                items={departments}
                setOpen={setDepartmentOpen}
                setValue={(callback) => {
                  const newDepartment = callback(selectedDepartment);
                  setSelectedDepartment(newDepartment);
                }}
                placeholder="学科を選択"
                style={styles.department}
                containerStyle={styles.label}
                dropDownContainerStyle={styles.drop}
              />
            </View>
          )}
        </View>
        <View style={styles.headerRight}>
          <DropDownPicker
            open={termDayPeriodOpen}
            value={selectedTermDayPeriod}
            items={termDayPeriods}
            setOpen={setTermDayPeriodOpen}
            setValue={setSelectedTermDayPeriod}
            placeholder="学年を選択"
            style={styles.grade}
            containerStyle={styles.label}
            dropDownContainerStyle={styles.drop}
          />
        </View>
      </View>
      <Text style={styles.title}>{`${day}曜 ${period}限の授業を選択`}</Text>
      <Text style={{ fontSize: 12, color: "red", marginBottom: 5 }}>
        シラバスの情報が不足している講義が表示される可能性があります。
        全学教育科目は学部を全学教育科目に変更してください
      </Text>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.courseItem}
            onPress={() => handleSelectCourse(item)}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              講義名: {item.courseTitle || "不明なコース"} -{item.requiredSelected || "不明"}-
            </Text>
            <Text>
              担当教員: {item.instructor.replace(/\n/g, " / ") || "不明なコース"}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <Text style={styles.emptyMessage}>検索結果がありません</Text>
        )}
      />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>戻る</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#fff",
  },
  headerConstainer: {
    height: 50,
    flexDirection: "row",
    width: "100%",
  },
  headerLeft: {
    flex: 1,
    flexDirection: "row",
  },
  degree: {
    flex: 1,
    borderWidth: 0,
  },
  department: {
    flex: 2,
    borderWidth: 0,
  },
  label: {
    borderWidth: 0,
  },
  drop: {
    borderWidth: 0,
  },
  headerRight: {
    width: 110,
    flexDirection: "row",
  },
  grade: {
    flex: 1,
    borderWidth: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  courseItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  backButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ClassSelection;
