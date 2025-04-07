import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import { db } from "../../../../004BackendModules/firebaseMetod/firebase";
import { doc, getDoc } from "firebase/firestore";

const FreeMarketDetail = ({ route,navigation }) => {
  const { MarketId} = route.params; // ルートパラメータからIDを取得
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const docRef = doc(db, "freemarketItems", MarketId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          // Timestampを日付形式に変換
          if (data.createdAt) {
            data.createdAt = new Date(data.createdAt.seconds * 1000).toLocaleDateString();
          }
          setItem(data);
        } else {
          console.error("指定された商品が見つかりませんでした。");
        }
      } catch (error) {
        console.error("商品の取得中にエラーが発生しました:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [MarketId]);

  const handlePurchase = () => {
    Alert.alert("購入", "購入手続きが開始されます。");
  };

  const handleAskSeller = () => {
    Alert.alert("質問", "出品者に質問を送信します。");
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!item) {
    return (
      <View style={styles.container}>
        <Text>商品が見つかりませんでした。</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 右上のボタン */}
      <View style={styles.topRightButtons}>
        <TouchableOpacity style={styles.button} onPress={handlePurchase}>
          <Text style={styles.buttonText}>購入する</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleAskSeller}>
          <Text style={styles.buttonText}>出品者に質問する</Text>
        </TouchableOpacity>
      </View>

      {/* 商品詳細 */}
      <Text style={styles.header}>{item.itemName}</Text>
      <Text style={styles.text}>価格: {item.cost}円</Text>
      <Text style={styles.text}>状態: {item.itemCondition}</Text>
      <Text style={styles.text}>説明: {item.itemDescription}</Text>
      {item.images && item.images.map((uri, index) => (
        <Image key={index} source={{ uri }} style={styles.image} />
      ))}

        <Text style={styles.text}>受け取り方法: {item.receivestate}</Text>
        
        
        <Text style={styles.text}>投稿日: {item.createdAt}</Text>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa", // HomeScreen.jsに合わせた背景色
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e3a8a", // HomeScreen.jsに合わせた色
    marginBottom: 16,
    textAlign: "center",
  },
  image: {
    width: "30%", // 写真を全体に表示
    height: 350, // 高さを調整
    marginBottom: 16,
    borderRadius: 8,
    resizeMode: "cover", // 写真全体を表示
  },
  text: {
    fontSize: 16,
    color: "#333", // テキストの色を調整
    marginBottom: 8,
  },
  topRightButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default FreeMarketDetail;
