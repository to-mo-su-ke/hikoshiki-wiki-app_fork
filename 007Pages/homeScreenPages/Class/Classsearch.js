import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Modal, ScrollView } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../006Configs/firebaseConfig2";

const Classsearch = () => {
  const [searchText, setSearchText] = useState(""); // 検索キーワード
  const [classes, setClasses] = useState([]); // Firestoreから取得した授業データ
  const [filteredClasses, setFilteredClasses] = useState([]); // フィルタリングされた授業データ
  const [selectedClass, setSelectedClass] = useState(null); // 選択された授業データ
  const [modalVisible, setModalVisible] = useState(false); // モーダルの表示状態

  // Firestoreからデータを取得する関数
  const fetchClass = async () => {
    try {
      const classCollectionRef = collection(db, "classreview"); // コレクション名を指定
      const classCollection = await getDocs(classCollectionRef);
      const classList = classCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setClasses(classList);
      setFilteredClasses(classList); // 初期状態ではすべての授業を表示
    } catch (error) {
      console.error("Error fetching class: ", error);
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
    setSelectedClass(null); // 選択された授業をリセット
  };

  const renderClassItem = ({ item }) => (
    <TouchableOpacity
      style={styles.classItem}
      onPress={() => {
        setSelectedClass(item);
        setModalVisible(true); // モーダルを表示
      }}
    >
      <Text style={styles.className}>{item.name}</Text>
      <Text style={styles.classProfessor}>教授: {item.professor}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
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
      <FlatList
        data={filteredClasses}
        keyExtractor={(item) => item.id}
        renderItem={renderClassItem}
        contentContainerStyle={styles.listContent}
      />
      {selectedClass && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)} // モーダルを閉じる
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ScrollView>
                <Text style={styles.title}>{selectedClass.name}</Text>
                <Text style={styles.label}>教授名</Text>
                <Text style={styles.value}>{selectedClass.professor}</Text>

                <Text style={styles.label}>年度</Text>
                <Text style={styles.value}>{selectedClass.year}</Text>

                <Text style={styles.label}>学期</Text>
                <Text style={styles.value}>{selectedClass.semester}</Text>

                <Text style={styles.label}>出欠</Text>
                <Text style={styles.value}>{selectedClass.attendance}</Text>

                <Text style={styles.label}>評価方法</Text>
                <Text style={styles.value}>{selectedClass.evaluation}</Text>

                <Text style={styles.label}>単位の取りやすさ</Text>
                <Text style={styles.value}>{selectedClass.easeOfCredit}</Text>

                <Text style={styles.label}>内容</Text>
                <Text style={styles.value}>{selectedClass.content}</Text>

                <Text style={styles.label}>コメント</Text>
                <Text style={styles.value}>{selectedClass.comment || "なし"}</Text>
              </ScrollView>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)} // モーダルを閉じる
              >
                <Text style={styles.closeButtonText}>閉じる</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16,
  },
  searchInput: {
    height: 48,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#ffffff",
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
  listContent: {
    paddingBottom: 16,
  },
  classItem: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  className: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: 4,
  },
  classProfessor: {
    fontSize: 14,
    color: "#64748b",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // 背景を半透明に
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1e3a8a",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 16,
    color: "#334155",
  },
  value: {
    fontSize: 16,
    color: "#64748b",
    marginTop: 4,
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
});

export default Classsearch;