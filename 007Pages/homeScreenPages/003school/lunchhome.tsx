import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  ScrollView,
} from "react-native";
import { db } from "../../../006Configs/firebaseConfig2";
import { collection, addDoc, getDocs, Timestamp } from "firebase/firestore";

// 型定義
interface MenuScore {
  totalScore: number;
  count: number;
}

const LunchHome = () => {
  const [selectedTab, setSelectedTab] = useState("南部"); // 現在選択されているタブ
  const [menu, setMenu] = useState(""); // 本日のメニュー
  const [price, setPrice] = useState(""); // 価格
  const [tasteRating, setTasteRating] = useState(0); // 味の評価
  const [volumeRating, setVolumeRating] = useState(0); // 量の評価
  const [review, setReview] = useState(""); // レビュー内容
  const [ranking, setRanking] = useState([]); // ランキングデータ

  useEffect(() => {
    fetchRanking();
  }, []);

  const fetchRanking = async () => {
    try {
      const lunchReviewsCollection = collection(db, "lunchReviews");
      const snapshot = await getDocs(lunchReviewsCollection);

      const reviews = snapshot.docs.map((doc) => doc.data());
      const menuScores: Record<string, MenuScore> = {}; // 型を明確に定義

      reviews.forEach((review) => {
        const { menu, tasteRating, volumeRating } = review;
        if (!menuScores[menu]) {
          menuScores[menu] = { totalScore: 0, count: 0 };
        }
        menuScores[menu].totalScore += tasteRating + volumeRating;
        menuScores[menu].count += 1;
      });

      const sortedMenus = Object.entries(menuScores)
        .map(([menu, { totalScore, count }]) => ({
          menu,
          averageScore: totalScore / count,
        }))
        .sort((a, b) => b.averageScore - a.averageScore)
        .slice(0, 3);

      setRanking(sortedMenus);
    } catch (error) {
      console.error("ランキングの取得中にエラーが発生しました:", error);
    }
  };

  const handleSubmitReview = async () => {
    if (!menu || !price || !tasteRating || !volumeRating || !review) {
      Alert.alert("エラー", "すべての項目を入力してください。");
      return;
    }

    try {
      const lunchReviewsCollection = collection(db, "lunchReviews");
      await addDoc(lunchReviewsCollection, {
        menu,
        price: Number(price),
        tasteRating,
        volumeRating,
        review,
        location: selectedTab,
        date: Timestamp.now(),
      });

      Alert.alert("成功", "レビューを送信しました！");
      setMenu("");
      setPrice("");
      setTasteRating(0);
      setVolumeRating(0);
      setReview("");
      fetchRanking(); // ランキングを更新
    } catch (error) {
      console.error("レビューの送信中にエラーが発生しました:", error);
      Alert.alert("エラー", "レビューの送信に失敗しました。");
    }
  };

  const renderRankingItem = ({ item, index }) => (
    <View style={styles.rankingItem}>
      <Text style={styles.rankingNumber}>{index + 1}</Text>
      <Text style={styles.rankingText}>
        {item.menu} - 平均スコア: {item.averageScore.toFixed(2)}
      </Text>
    </View>
  );

  const renderRatingButtons = (rating, setRating) => (
    <View style={styles.ratingContainer}>
      {[1, 2, 3, 4, 5].map((value) => (
        <TouchableOpacity
          key={value}
          style={[
            styles.ratingButton,
            rating === value && styles.activeRatingButton,
          ]}
          onPress={() => setRating(value)}
        >
          <Text
            style={[
              styles.ratingButtonText,
              rating === value && styles.activeRatingButtonText,
            ]}
          >
            {value}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* タブ切り替え */}
      <View style={styles.tabContainer}>
        {["南部", "北部", "フォレスト"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              selectedTab === tab && styles.activeTab,
            ]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ランキング */}
      <View style={styles.rankingContainer}>
        <Text style={styles.rankingHeader}>ランキング: 迷ったらこれ！</Text>
        <FlatList
          data={ranking}
          renderItem={renderRankingItem}
          keyExtractor={(item, index) => index.toString()}
          nestedScrollEnabled={true} // これを追加
        />
      </View>

      {/* 学食レビュー */}
      <View style={styles.reviewContainer}>
        <Text style={styles.reviewHeader}>学食レビュー</Text>
        <Text style={styles.reviewQuestion}>
          本日のメインメニューは何ですか？
        </Text>
        <TextInput
          style={styles.input}
          placeholder="メニュー名を入力"
          value={menu}
          onChangeText={setMenu}
        />
        <Text style={styles.reviewLabel}>価格</Text>
        <TextInput
          style={styles.input}
          placeholder="価格を入力"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
        <Text style={styles.reviewLabel}>味</Text>
        {renderRatingButtons(tasteRating, setTasteRating)}
        <Text style={styles.reviewLabel}>量</Text>
        {renderRatingButtons(volumeRating, setVolumeRating)}
        <Text style={styles.reviewLabel}>レビュー</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="レビュー内容を入力"
          value={review}
          onChangeText={setReview}
          multiline
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmitReview}>
          <Text style={styles.submitButtonText}>送信</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#1e3a8a",
  },
  tabText: {
    fontSize: 16,
    color: "#6b7280",
  },
  activeTabText: {
    color: "#1e3a8a",
    fontWeight: "bold",
  },
  rankingContainer: {
    marginBottom: 16,
  },
  rankingHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  rankingItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  rankingNumber: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  rankingText: {
    fontSize: 16,
  },
  reviewContainer: {
    marginTop: 16,
  },
  reviewHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  reviewQuestion: {
    fontSize: 16,
    marginBottom: 8,
  },
  reviewLabel: {
    fontSize: 14,
    marginBottom: 4,
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
  textArea: {
    height: 80,
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  ratingButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  activeRatingButton: {
    backgroundColor: "#4CAF50",
  },
  ratingButtonText: {
    fontSize: 16,
    color: "#6b7280",
  },
  activeRatingButtonText: {
    color: "#fff",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LunchHome;