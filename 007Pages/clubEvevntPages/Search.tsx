import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../006Configs/firebaseConfig2";
import { Calendar } from "react-native-calendars";

const Search = () => {
  const [searchName, setSearchName] = useState("");
  const [searchCost, setSearchCost] = useState("");
  const [results, setResults] = useState([]);
  const [selectedDates, setSelectedDates] = useState({});
  const [markedDates, setMarkedDates] = useState({});

  // Firestoreから新歓がある日付を取得してカレンダーに色付け
  const fetchEventDates = async (filter = false) => {
    try {
      const eventsRef = collection(db, "events");
      let q = query(eventsRef);

      // 絞り込み条件が入力されている場合はクエリを追加
      if (filter) {
        if (searchName) {
          q = query(q, where("name", "==", searchName));
        }
        if (searchCost) {
          q = query(q, where("cost", "==", parseInt(searchCost, 10)));
        }
      }

      const querySnapshot = await getDocs(q);
      const dates = {};

      querySnapshot.forEach((doc) => {
        const eventData = doc.data();
        if (eventData.date) {
          dates[eventData.date] = {
            selected: true,
            selectedtColor:  "blue" // 絞り込み時は青、それ以外は赤
          };
        }
      });

      setMarkedDates(dates);
    } catch (error) {
      console.error("Error fetching event dates: ", error);
      Alert.alert("エラー", "イベント日程の取得中にエラーが発生しました");
    }
  };

  useEffect(() => {
    // 初回ロード時はすべての日程を色付け
    fetchEventDates();
  }, []);

  // カレンダーで日付を選択または解除
  const onDayPress = (day) => {
    const date = day.dateString;

    setSelectedDates((prevSelectedDates) => {
      const updatedDates = { ...prevSelectedDates };

      if (updatedDates[date]) {
        // 選択解除
        delete updatedDates[date];
      } else {
        // 選択
        updatedDates[date] = {
          selected: true,
          selectedColor: "green",
        };
      }

      return updatedDates;
    });
  };

  // 検索処理
  const handleSearch = async () => {
    if (!searchName && !searchCost) {
      Alert.alert("エラー", "少なくとも1つの条件を入力してください");
      return;
    }

    try {
      const eventsRef = collection(db, "events");
      let q = query(eventsRef);

      if (searchName) {
        q = query(q, where("name", "==", searchName));
      }
      if (searchCost) {
        q = query(q, where("cost", "==", parseInt(searchCost, 10)));
      }

      const querySnapshot = await getDocs(q);
      const matchedEvents = [];
      const matchedDates = {};

      querySnapshot.forEach((doc) => {
        const eventData = doc.data();
        matchedEvents.push(eventData);

        // 条件に合致する日程を色付け
        if (eventData.date) {
          matchedDates[eventData.date] = {
            marked: true,
            dotColor: "blue",
          };
        }
      });

      setResults(matchedEvents);
      setMarkedDates(matchedDates); // 絞り込み条件に合致する日程のみを色付け

      if (matchedEvents.length === 0) {
        Alert.alert("結果なし", "条件に一致する新歓が見つかりませんでした");
      }
    } catch (error) {
      console.error("Error searching events: ", error);
      Alert.alert("エラー", "検索中にエラーが発生しました");
    }
  };

  return (
    <FlatList
      style={styles.container}
      data={results}
      keyExtractor={(item, index) => index.toString()}
      ListHeaderComponent={
        <View>
          <Text style={styles.title}>新歓検索</Text>

          <Text style={styles.label}>名前</Text>
          <TextInput
            style={styles.input}
            placeholder="新歓名を入力"
            value={searchName}
            onChangeText={setSearchName}
          />

          <Text style={styles.label}>費用</Text>
          <TextInput
            style={styles.input}
            placeholder="費用を入力"
            value={searchCost}
            onChangeText={setSearchCost}
            keyboardType="numeric"
          />

          <Button
            title="絞り込み"
            onPress={() => {
              handleSearch();
              fetchEventDates(true); // 絞り込み条件に合致する日程を色付け
            }}
          />
          <Text style={styles.resultTitle}>検索結果</Text>

          <Text style={styles.label}>日程</Text>
          <Calendar
            onDayPress={onDayPress}
            markedDates={{
              ...markedDates,
              ...selectedDates,
            }}
          />
        </View>
      }
      renderItem={({ item }) => (
        <Text style={styles.resultItem}>
          {item.name} - {item.date} - ¥{item.cost}
        </Text>
      )}
    />
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
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    color: "#1e3a8a",
  },
  resultItem: {
    fontSize: 16,
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
});

export default Search;