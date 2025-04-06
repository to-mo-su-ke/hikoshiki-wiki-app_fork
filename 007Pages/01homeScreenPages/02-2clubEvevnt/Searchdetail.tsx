import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { db } from "../../006Configs/firebaseConfig2";

const SearchDetail = ({ route }) => {
  const { eventId } = route.params;
  const [event, setEvent] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null); // 写真のURLを保存するステート
  const [photoError, setPhotoError] = useState(null); // 写真取得エラーを保存するステート

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) {
        console.error("Error: eventId is undefined");
        return;
      }

      try {
        const eventDocRef = doc(db, "events", eventId);
        const eventDoc = await getDoc(eventDocRef);
        if (eventDoc.exists()) {
          const eventData = eventDoc.data();
          setEvent(eventData);

          // Firebase Storage から写真のURLを取得
          if (eventData.photo) {
            const storage = getStorage();
            const photoRef = ref(storage, eventData.photo); // photo フィールドにはストレージ内のパスが格納されていると仮定
            const url = await getDownloadURL(photoRef);
            console.log("Photo URL:", url); // URL をログに出力
            setPhotoUrl(url); // ダウンロードURLをステートに保存
          }
        } else {
          console.error("Error: Event document does not exist");
        }
      } catch (error) {
        console.error("Error fetching event details: ", error);
        setPhotoError("写真の取得中にエラーが発生しました");
      }
    };

    fetchEvent();
  }, [eventId]);

  if (!event) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{event.name || "イベント名がありません"}</Text>
      <Text style={styles.label}>日程</Text>
      <Text style={styles.value}>{event.date || "日程が未設定です"}</Text>

      <Text style={styles.label}>場所</Text>
      <Text style={styles.value}>{event.location || "場所が未設定です"}</Text>

      <Text style={styles.label}>費用</Text>
      <Text style={styles.value}>¥{event.fee || "未設定"}</Text>

      <Text style={styles.label}>時間</Text>
      <Text style={styles.value}>{event.time || "時間が未設定です"}</Text>

      <Text style={styles.label}>説明</Text>
      <Text style={styles.value}>{event.description || "説明がありません"}</Text>

      <Text style={styles.label}>定員</Text>
      <Text style={styles.value}>{event.capacity || "未設定"} 人</Text>

      {photoError ? (
        <Text style={styles.errorText}>{photoError}</Text>
      ) : photoUrl ? (
        <>
          <Text style={styles.label}>イベント写真</Text>
          <Image source={{ uri: photoUrl }} style={styles.image} />
        </>
      ) : (
        <Text style={styles.value}>写真がありません</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#1e3a8a",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 8,
    color: "#334155",
  },
  value: {
    fontSize: 16,
    color: "#475569",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#64748b",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    marginTop: 16,
  },
});

export default SearchDetail;