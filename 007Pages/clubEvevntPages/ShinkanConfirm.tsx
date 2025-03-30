
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView,  TextInput,
    TouchableOpacity,
    Alert,} from "react-native";
import { doc, getDoc,updateDoc } from "firebase/firestore";
import { db } from "../../006Configs/firebaseConfig2";

const ShinkanConfirm = ({ route, navigation }) => {
  const { docId } = route.params; // ShinkanInfo から渡されたドキュメント ID
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false); // 編集モードの状態
  const [formData, setFormData] = useState({
    date: "",
    location: "",
    fee: "",
    time: "",
    description: "",
  })

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (!docId) {
          Alert.alert("エラー", "ドキュメント ID が渡されていません");
          return;
        }

        const eventDocRef = doc(db, "events", docId);
        const eventDoc = await getDoc(eventDocRef);

        if (eventDoc.exists()) {
            const eventData = eventDoc.data();
            setEvent(eventData);
            setFormData({
              date: eventData.date || "",
              location: eventData.location || "",
              fee: eventData.fee || "",
              time: eventData.time || "",
              description: eventData.description || "",
            });
          } else {
            Alert.alert("エラー", "指定された新歓情報が見つかりません");
          }
        } catch (error) {
          console.error("Error fetching event details:", error);
          Alert.alert("エラー", "新歓情報の取得中にエラーが発生しました");
        } finally {
          setLoading(false);
        }
      };
  
      fetchEvent();
    }, [docId]);
    const handleSave = async () => {
        try {
          const eventDocRef = doc(db, "events", docId);
          await updateDoc(eventDocRef, {
            date: formData.date,
            location: formData.location,
            fee: formData.fee,
            time: formData.time,
            description: formData.description,
          });
    
          Alert.alert("保存完了", "新歓情報が更新されました");
          setEditing(false);
        } catch (error) {
          console.error("Error updating event details:", error);
          Alert.alert("エラー", "新歓情報の更新中にエラーが発生しました");
        }
      };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>読み込み中...</Text>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>新歓情報が見つかりません。</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{event.name || "新歓イベント"}</Text>
      <Text style={styles.label}>日程</Text>
      {editing ? (
        <TextInput
          style={styles.input}
          value={formData.date}
          onChangeText={(text) => setFormData({ ...formData, date: text })}
        />
      ) : (
        <Text style={styles.value}>{event.date || "未設定"}</Text>
      )}


<Text style={styles.label}>場所</Text>
      {editing ? (
        <TextInput
          style={styles.input}
          value={formData.location}
          onChangeText={(text) => setFormData({ ...formData, location: text })}
        />
      ) : (
        <Text style={styles.value}>{event.location || "未設定"}</Text>
      )}

<Text style={styles.label}>費用</Text>
      {editing ? (
        <TextInput
          style={styles.input}
          value={formData.fee}
          onChangeText={(text) => setFormData({ ...formData, fee: text })}
          keyboardType="numeric"
        />
      ) : (
        <Text style={styles.value}>¥{event.fee || "未設定"}</Text>
      )}

<Text style={styles.label}>時間</Text>
      {editing ? (
        <TextInput
          style={styles.input}
          value={formData.time}
          onChangeText={(text) => setFormData({ ...formData, time: text })}
        />
      ) : (
        <Text style={styles.value}>{event.time || "未設定"}</Text>
      )}

<Text style={styles.label}>説明</Text>
      {editing ? (
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.description}
          onChangeText={(text) =>
            setFormData({ ...formData, description: text })
          }
          multiline
        />
      ) : (
        <Text style={styles.value}>{event.description || "説明がありません"}</Text>
      )}

      {editing ? (
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>保存する</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setEditing(true)}
        >
          <Text style={styles.editButtonText}>編集する</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.label}>予約一覧</Text>
      {event.member && event.member.length > 0 ? (
        event.member.map((member, index) => (
          <View key={index} style={styles.memberContainer}>
            <Text style={styles.memberIndex}>予約番号: {index + 1}</Text>
            <Text style={styles.memberDetail}>名前: {member.name}</Text>
            <Text style={styles.memberDetail}>学籍番号: {member.studentId}</Text>
            <Text style={styles.memberDetail}>メール: {member.email}</Text>
            <Text style={styles.memberDetail}>
              コメント: {member.comments || "なし"}
            </Text>
          </View>
        ))
      ) : (
        <Text style={styles.noMemberText}>予約情報がありません。</Text>
      )}
    </ScrollView>
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  editButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
  memberContainer: {
    backgroundColor: "#f9f9f9",
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  memberIndex: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
  },
  memberDetail: {
    fontSize: 14,
    color: "#555",
  },
  noMemberText: {
    fontSize: 14,
    color: "#999",
  },
});

export default ShinkanConfirm;