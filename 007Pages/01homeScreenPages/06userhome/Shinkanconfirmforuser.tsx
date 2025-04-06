import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  FlatList,
} from "react-native";
import {
  collection,
  getDocs,
  getDoc,
  updateDoc,
  arrayRemove,
  doc,
} from "firebase/firestore";
import { db } from "../../../006Configs/firebaseConfig";

const ShinkanConfirmForUser = ({ route, navigation }) => {
  const { Id } = route.params || {}; // route.params から Id を取得
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      if (!Id) {
        Alert.alert("エラー", "ユーザーIDが渡されていません");
        setLoading(false);
        return;
      }

      try {
        // Firestore からすべてのイベントを取得
        const eventsRef = collection(db, "events");
        const querySnapshot = await getDocs(eventsRef);

        const userReservations = [];
        querySnapshot.forEach((doc) => {
          const eventData = doc.data();

          // member 配列を全探索して uid を確認
          if (eventData.member && eventData.member.some((member) => member.uid === Id)) {
            userReservations.push({
              id: doc.id,
              name: eventData.name || "名称未設定",
              date: eventData.date || "日程未定",
              location: eventData.location || "場所未定",
              fee: eventData.fee || 0,
              explain: eventData.explain || "説明なし",
              member: eventData.member, // メンバー情報を保持
            });
          }
        });

        setReservations(userReservations);
      } catch (error) {
        console.error("Error fetching reservations:", error);
        Alert.alert("エラー", "予約情報の取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [Id]);

  const handleCancelReservation = async (reservationUid, eventId) => {
    try {
      const eventDocRef = doc(db, "events", eventId);

      // Firestore から現在のイベントデータを取得
      const eventDoc = await getDoc(eventDocRef);
      if (!eventDoc.exists()) {
        Alert.alert("エラー", "イベントが見つかりません");
        return;
      }

      const eventData = eventDoc.data();
      const memberToRemove = eventData.member.find((member) => member.uid === reservationUid);

      if (!memberToRemove) {
        Alert.alert("エラー", "指定された予約が見つかりません");
        return;
      }

      // Firestore の member 配列から予約を削除
      await updateDoc(eventDocRef, {
        member: arrayRemove(memberToRemove),
      });

      Alert.alert("予約削除", "予約が削除されました");
      setReservations((prevReservations) =>
        prevReservations.filter((reservation) => reservation.id !== eventId)
      );
    } catch (error) {
      console.error("Error canceling reservation:", error);
      Alert.alert("エラー", "予約の削除に失敗しました");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>読み込み中...</Text>
      </View>
    );
  }

  if (reservations.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>予約した新歓がありません。</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={reservations}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.reservationItem}>
          <Text style={styles.reservationTitle}>{item.name}</Text>
          <Text style={styles.reservationDetail}>日程: {item.date}</Text>
          <Text style={styles.reservationDetail}>場所: {item.location}</Text>
          <Text style={styles.reservationDetail}>費用: {item.fee}円</Text>
          <Text style={styles.reservationDetail}>説明: {item.explain}</Text>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => handleCancelReservation(Id, item.id)}
          >
            <Text style={styles.cancelButtonText}>予約を削除</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#555",
  },
  emptyText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
  reservationItem: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  reservationTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  reservationDetail: {
    fontSize: 14,
    color: "#777",
    marginBottom: 4,
  },
  cancelButton: {
    backgroundColor: "#FF5733",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 8,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default ShinkanConfirmForUser;