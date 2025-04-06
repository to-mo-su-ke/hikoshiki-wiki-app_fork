import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { getAuth } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { db, storage } from "../../../006Configs/firebaseConfig";
import { ref, uploadBytes } from "firebase/storage";
import { Calendar } from "react-native-calendars";
import * as ImagePicker from "expo-image-picker";

const EventRegist = ({ navigation }) => {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventFee, setEventFee] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventCapacity, setEventCapacity] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [eventPhoto, setEventPhoto] = useState(null);
  const [eventPhotoLocal, setEventPhotoLocal] = useState(null);

  // カレンダーで日付を選択
  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
    setEventDate(day.dateString);
  };

  // 写真選択メソッド
  const handleSelectPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const photoUri = result.assets[0].uri;
      setEventPhotoLocal(photoUri);
      Alert.alert("写真が選択されました");
    }
  };

  // Firestoreにイベント情報を保存
  const handleSubmit = async () => {
    if (
      !eventName ||
      !eventDate ||
      !eventLocation ||
      !eventFee ||
      !eventTime ||
      !eventDescription ||
      !eventCapacity
    ) {
      Alert.alert("エラー", "すべての項目を入力してください");
      return;
    }

    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        Alert.alert("エラー", "ログインしていません");
        return;
      }

      const uid = currentUser.uid;

      // 写真をアップロード
      let photoUrl = null;
      if (eventPhotoLocal) {
        const response = await fetch(eventPhotoLocal);
        const blob = await response.blob();
        const photoRef = ref(storage, `events/${uid}/${Date.now()}.jpg`);
        await uploadBytes(photoRef, blob);
        photoUrl = `gs://${photoRef.bucket}/${photoRef.fullPath}`;
      }

      const eventData = {
        name: eventName,
        date: eventDate,
        location: eventLocation,
        fee: eventFee,
        time: eventTime,
        description: eventDescription,
        capacity: eventCapacity,
        photo: photoUrl,
        createdBy: uid,
        // 定員分の空の要素を持つmember配列を追加
        member: Array(parseInt(eventCapacity) || 0).fill(null),
      };

      await addDoc(collection(db, "events"), eventData);

      Alert.alert("成功", "新歓情報が登録されました");
      navigation.goBack();
    } catch (error) {
      console.error("Error adding event: ", error);
      Alert.alert("エラー", "新歓情報の登録に失敗しました");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>新歓情報登録</Text>

      <Text style={styles.label}>イベント名</Text>
      <TextInput
        style={styles.input}
        placeholder="イベント名を入力"
        value={eventName}
        onChangeText={setEventName}
      />

      <Text style={styles.label}>日程</Text>
      <Calendar
        onDayPress={onDayPress}
        markedDates={{
          [selectedDate]: { selected: true, marked: true, selectedColor: "blue" },
        }}
      />

      <Text style={styles.label}>場所</Text>
      <TextInput
        style={styles.input}
        placeholder="場所を入力"
        value={eventLocation}
        onChangeText={setEventLocation}
      />

      <Text style={styles.label}>費用</Text>
      <TextInput
        style={styles.input}
        placeholder="例: 1000"
        keyboardType="numeric"
        value={eventFee}
        onChangeText={setEventFee}
      />

      <Text style={styles.label}>時間</Text>
      <TextInput
        style={styles.input}
        placeholder="例: 18:00"
        value={eventTime}
        onChangeText={setEventTime}
      />

      <Text style={styles.label}>説明</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="イベントの説明を入力"
        value={eventDescription}
        onChangeText={setEventDescription}
        multiline={true}
      />

      <Text style={styles.label}>定員</Text>
      <TextInput
        style={styles.input}
        placeholder="例: 50"
        keyboardType="numeric"
        value={eventCapacity}
        onChangeText={setEventCapacity}
      />

      <Text style={styles.label}>イベント写真</Text>
      <Button title="写真を選択" onPress={handleSelectPhoto} />
      {eventPhotoLocal && (
        <Image source={{ uri: eventPhotoLocal }} style={styles.imagePreview} />
      )}

      <Button title="登録する" onPress={handleSubmit} />
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
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    backgroundColor: "#fff",
    fontSize: 15,
  },
  imagePreview: {
    width: 150,
    height: 150,
    marginVertical: 8,
    borderRadius: 8,
  },
});

export default EventRegist;