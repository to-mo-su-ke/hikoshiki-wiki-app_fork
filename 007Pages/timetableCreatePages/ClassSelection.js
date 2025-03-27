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
import { addCourse } from "../../010Redux/actions";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import app from "../../004BackendModules/messageMetod/firestore";

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
    backgroundColor: "#f8f9fa",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1e3a8a",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    fontSize: 15,
  },
  courseItem: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: 4,
  },
  courseInfo: {
    marginBottom: 10,
    color: "#64748b",
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  selectButton: {
    backgroundColor: "#e0f2fe",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#64748b",
    fontSize: 16,
  },
});

export default ClassSelection;
