import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Alert,
} from "react-native";
import { db } from "../../../../004BackendModules/firebaseMetod/firebase"; // Firebaseの初期化
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native"; // ナビゲーションを追加

const FreemarketHome = () => {
  const [searchKeyword, setSearchKeyword] = useState(""); // 検索キーワード
  const [searchResults, setSearchResults] = useState([]); // 検索結果を管理する状態を追加
 
  const navigation = useNavigation(); // ナビゲーションフック

  const handleSearch = async () => {
    if (!searchKeyword || !searchKeyword.trim()) { // 空文字やundefinedをチェック
      Alert.alert("エラー", "検索キーワードを入力してください。");
      return;
    }

    try {
      const freemarketCollection = collection(db, "freemarketItems");
      const q = query(
        freemarketCollection,
        where("itemName", ">=", searchKeyword),
        where("itemName", "<=", searchKeyword + "\uf8ff")
      );
      const snapshot = await getDocs(q);

      const results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSearchResults(results); // 検索結果を状態に保存
    } catch (error) {
      console.error("検索中にエラーが発生しました:", error);
      Alert.alert("エラー", "検索に失敗しました。");
    }
  };

  

  const renderSearchResultItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate("FreeMarketDetail", { MarketId: item.id })}>
      <View style={styles.resultItem}>
        <Text style={styles.resultItemName}>{item.itemName}</Text>
        <Text>価格: {item.cost}円</Text>
        {item.images && item.images.length > 0 && (
          <Image source={{ uri: item.images[0] }} style={styles.resultItemImage} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>フリーマーケット検索</Text>
     

      {/* 検索入力 */}
      <TextInput
        style={styles.input}
        placeholder="商品名または説明を入力"
        value={searchKeyword}
        onChangeText={setSearchKeyword}
      />

      {/* 検索ボタン */}
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>検索</Text>
      </TouchableOpacity>

      {/* 検索結果 */}
      {searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={renderSearchResultItem}
          keyExtractor={(item, index) => index.toString()}
          style={styles.resultsList}
        />
      ) : (
        <Text style={styles.noResultsText}>検索結果がありません。</Text>
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  searchButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultsList: {
    marginTop: 16,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  resultItemName: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  resultItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginLeft: 8,
  },
  noResultsText: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 16,
  },
});

export default FreemarketHome;