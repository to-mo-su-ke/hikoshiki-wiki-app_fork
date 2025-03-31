import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../006Configs/firebaseConfig2";

const ShinkanInfo = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (!currentUser) {
          Alert.alert("エラー", "ログインしていません");
          return;
        }

        const uid = currentUser.uid;

        // Firestoreからログインユーザーが作成した新歓を取得
        const eventsRef = collection(db, "events");
        const q = query(eventsRef, where("createdBy", "==", uid));
        const querySnapshot = await getDocs(q);
       
       

        const userEvents = [];
        querySnapshot.forEach((doc) => {
          userEvents.push({ id: doc.id, ...doc.data() });
        });

        setEvents(userEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
        Alert.alert("エラー", "新歓情報の取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>読み込み中...</Text>
      </View>
    );
  }

  if (events.length === 0) {
    return (
      <View style={styles.container}>
        <Text>登録された新歓がありません。</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>登録した新歓</Text>
      {events.map((event) => (
        <View key={event.id} style={styles.eventItem}>
          <Text style={styles.eventName}>{event.name}</Text>
          <TouchableOpacity
            style={styles.detailButton}
            onPress={() =>
              navigation.navigate("ShinkanConfirm", { docId: event.id })
            }
          >
            <Text style={styles.detailButtonText}>詳細を見る</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  eventItem: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  eventName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  detailButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: "center",
  },
  detailButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ShinkanInfo;