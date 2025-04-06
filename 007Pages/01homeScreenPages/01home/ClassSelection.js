import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  FlatList, 
  ActivityIndicator 
} from "react-native";
import { useDispatch } from "react-redux";
import { addCourse } from "../../../010Redux/actions";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import app from "../../../004BackendModules/firebaseMetod/firestore";

const ClassSelection = ({ route, navigation }) => {
  const { day, period, termDayPeriod, degree } = route.params;
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const db = getFirestore(app);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      searchCourses(searchTerm);
    } else {
      setCourses([]);
    }
  }, [searchTerm]);

  const searchCourses = async (term) => {
    setLoading(true);
    try {
      const syllabusRef = collection(db, "syllabus");
      // 検索ロジックをFirestoreクエリで実装
      // 科目名、教員名、科目コード等でフィルタリング
      const q = query(
        syllabusRef,
        where("courseTitle", ">=", term),
        where("courseTitle", "<=", term + "\uf8ff")
      );

      const querySnapshot = await getDocs(q);
      const foundCourses = [];
      querySnapshot.forEach((doc) => {
        foundCourses.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setCourses(foundCourses);
    } catch (error) {
      console.error("Error searching courses:", error);
    }
    setLoading(false);
  };

  const handleSelectCourse = (course, courseType) => {
    dispatch(
      addCourse(
        degree,
        termDayPeriod,
        day,
        period,
        courseType,
        course.id
      )
    );
    navigation.goBack();
  };

  const renderCourseItem = ({ item }) => (
    <View style={styles.courseItem}>
      <Text style={styles.courseTitle}>{item.courseTitle || item.title}</Text>
      <Text style={styles.courseInfo}>{item.instructor} - {item.credits}単位</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => handleSelectCourse(item, 0)}
        >
          <Text>全時間枠</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => handleSelectCourse(item, 1)}
        >
          <Text>左半分</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => handleSelectCourse(item, 2)}
        >
          <Text>右半分</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {day}曜{period}限の授業を選択
      </Text>
      <TextInput
        style={styles.searchInput}
        placeholder="授業名や教員名で検索"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={courses}
          renderItem={renderCourseItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() => (
            <Text style={styles.emptyText}>
              {searchTerm.length < 2
                ? "2文字以上入力してください"
                : "該当する科目が見つかりませんでした"}
            </Text>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 16,
  },
  courseItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  courseInfo: {
    marginTop: 4,
    color: "#666",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  selectButton: {
    backgroundColor: "#e0e0e0",
    padding: 8,
    borderRadius: 4,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
});

export default ClassSelection;
