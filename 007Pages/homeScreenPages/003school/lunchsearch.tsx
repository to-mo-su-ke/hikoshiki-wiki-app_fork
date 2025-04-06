import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  ScrollView,
} from "react-native";
import { db } from "../../../006Configs/firebaseConfig2";
import { collection, getDocs, query, where } from "firebase/firestore";

const LunchSearch = () => {
  const [searchKeyword, setSearchKeyword] = useState(""); // 検索キーワード
  const [searchResults, setSearchResults] = useState([]); // 検索結果
  const [selectedMenuReviews, setSelectedMenuReviews] = useState([]); // 選択されたメニューのレビュー

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      Alert.alert("エラー", "検索キーワードを入力してください。");
      return;
    }

    try {
      const lunchReviewsCollection = collection(db, "lunchReviews");
      const snapshot = await getDocs(lunchReviewsCollection);

      const reviews = snapshot.docs.map((doc) => doc.data());
      const filteredResults = reviews.filter((review) =>
        review.menu.toLowerCase().includes(searchKeyword.toLowerCase())
      );

      setSearchResults(filteredResults);
    } catch (error) {
      console.error("検索中にエラーが発生しました:", error);
      Alert.alert("エラー", "検索に失敗しました。");
    }
  };

  const handleSelectMenu = async (menuName) => {
    try {
      const lunchReviewsCollection = collection(db, "lunchReviews");
      const q = query(lunchReviewsCollection, where("menu", "==", menuName));
      const snapshot = await getDocs(q);

      const reviews = snapshot.docs.map((doc) => doc.data());
      setSelectedMenuReviews(reviews);
    } catch (error) {
      console.error("レビューの取得中にエラーが発生しました:", error);
      Alert.alert("エラー", "レビューの取得に失敗しました。");
    }
  };

  const renderSearchResultItem = ({ item }) => (
    <TouchableOpacity
      style={styles.searchResultItem}
      onPress={() => handleSelectMenu(item.menu)}
    >
      <Text style={styles.searchResultText}>{item.menu}</Text>
    </TouchableOpacity>
  );

  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewItem}>
      <Text style={styles.reviewMenu}>メニュー: {item.menu}</Text>
      <Text style={styles.reviewText}>価格: {item.price}円</Text>
      <Text style={styles.reviewText}>味: {item.tasteRating}/5</Text>
      <Text style={styles.reviewText}>量: {item.volumeRating}/5</Text>
      <Text style={styles.reviewText}>レビュー: {item.review}</Text>
      <Text style={styles.reviewText}>投稿場所: {item.location}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* 検索機能 */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchHeader}>レビュー検索</Text>
        <TextInput
          style={styles.input}
          placeholder="メニュー名を入力"
          value={searchKeyword}
          onChangeText={setSearchKeyword}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>検索</Text>
        </TouchableOpacity>
      </View>

      {/* 検索結果 */}
      {searchResults.length > 0 && (
        <View style={styles.searchResultsContainer}>
          <Text style={styles.searchResultsHeader}>検索結果</Text>
          <FlatList
            data={searchResults}
            renderItem={renderSearchResultItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      )}

      {/* 選択されたメニューのレビュー */}
      {selectedMenuReviews.length > 0 && (
        <View style={styles.reviewsContainer}>
          <Text style={styles.reviewsHeader}>レビュー一覧</Text>
          <FlatList
            data={selectedMenuReviews}
            renderItem={renderReviewItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchHeader: {
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
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  searchResultsContainer: {
    marginBottom: 16,
  },
  searchResultsHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  searchResultItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  searchResultText: {
    fontSize: 16,
    color: "#1e3a8a",
  },
  reviewsContainer: {
    marginTop: 16,
  },
  reviewsHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  reviewItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  reviewMenu: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  reviewText: {
    fontSize: 14,
    marginBottom: 4,
  },
});

export default LunchSearch;