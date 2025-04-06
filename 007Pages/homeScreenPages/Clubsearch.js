import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../006Configs/firebaseConfig2";

const Classsearch = ({ navigation }) => {
  const [searchText, setSearchText] = useState(""); // 検索キーワード
  const [classes, setClasses] = useState([]); // Firestoreから取得した授業データ
  const [filteredClasses, setFilteredClasses] = useState([]); // フィルタリングされた授業データ
  const [loading, setLoading] = useState(false); // ローディング状態

  // Firestoreからデータを取得する関数
  const fetchClass = async () => {
    setLoading(true);
    try {
      const classCollectionRef = collection(db, "classreview"); // コレクション名を指定
      const classCollection = await getDocs(classCollectionRef);
      const classList = classCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setClasses(classList);
      setFilteredClasses(classList); // 初期状態ではすべての授業を表示
    } catch (error) {
      console.error("Error fetching class: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClass();
  }, []);

  // 検索ボタンを押したときの処理
  const handleSearch = () => {
    const filtered = classes.filter(
      (classroom) =>
        classroom.name.toLowerCase().includes(searchText.toLowerCase()) || // 授業名で部分一致
        classroom.professor.toLowerCase().includes(searchText.toLowerCase()) // 教授名で部分一致
    );
    setFilteredClasses(filtered);
  };

  // 検索条件をリセットする関数
  const handleReset = () => {
    setSearchText("");
    setFilteredClasses(classes); // すべての授業を表示
  };

  const renderClassItem = ({ item }) => (
    <TouchableOpacity
      style={styles.classItem}
      onPress={() => navigation.navigate("ClassDetail", { classId: item.id })}
    >
      <Text style={styles.className}>{item.name}</Text>
      <Text style={styles.classProfessor}>教授: {item.professor}</Text>
      <Text numberOfLines={2} style={styles.classDescription}>
        {item.description || "説明がありません"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>授業検索</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="授業名または教授名で検索"
        value={searchText}
        onChangeText={setSearchText}
      />
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.actionButton} onPress={handleSearch}>
          <Text style={styles.buttonText}>検索</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>リセット</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <Text style={styles.loadingText}>読み込み中...</Text>
      ) : filteredClasses.length > 0 ? (
        <FlatList
          data={filteredClasses}
          renderItem={renderClassItem}
          keyExtractor={(item) => item.id}
          style={styles.classesList}
        />
      ) : (
        <Text style={styles.noResults}>
          {searchText.length < 2
            ? "検索するには2文字以上入力してください"
            : "該当する授業がありません"}
        </Text>
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
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  resetButton: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  resetButtonText: {
    color: "#64748b",
    fontWeight: "600",
  },
  classesList: {
    flex: 1,
  },
  classItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  className: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  classProfessor: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  classDescription: {
    fontSize: 14,
    color: "#333",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
  noResults: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
});

export default Classsearch;