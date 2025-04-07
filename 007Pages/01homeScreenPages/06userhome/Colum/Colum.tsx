import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking } from "react-native";
import { db } from "../../../../004BackendModules/firebaseMetod/firebase";
import { collection, getDocs } from "firebase/firestore";

const Colum = () => {
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const columCollection = collection(db, "Colum"); // Firestoreのコレクション名
        const columSnapshot = await getDocs(columCollection);

        const fetchedColumns = columSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            date: data.Date?.toDate ? data.Date.toDate().toLocaleDateString() : "日付不明",
            title: data.Title || "タイトルなし",
            link: data.Link || "#",
          };
        });

        setColumns(fetchedColumns);
      } catch (error) {
        console.error("コラムの取得中にエラーが発生しました:", error);
      }
    };

    fetchColumns();
  }, []);

  const renderColumnItem = ({ item }) => (
    <View style={styles.columnItem}>
      <Text style={styles.columnDate}>{item.date}</Text>
      <TouchableOpacity onPress={() => Linking.openURL(item.link)}>
        <Text style={styles.columnTitle}>{item.title}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>コラム一覧</Text>
      <FlatList
        data={columns}
        renderItem={renderColumnItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: 16,
    textAlign: "center",
  },
  listContent: {
    paddingBottom: 16,
  },
  columnItem: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  columnDate: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 8,
  },
  columnTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e3a8a", // 青字
    textDecorationLine: "underline", // 下線を追加
  },
});

export default Colum;