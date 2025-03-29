import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../006Configs/firebaseConfig2";
import { Calendar } from "react-native-calendars";

const Search = ({ navigation }) => {
  const [searchName, setSearchName] = useState("");
  const [searchCost, setSearchCost] = useState("");
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [selectedDates, setSelectedDates] = useState({});
  const [markedDates, setMarkedDates] = useState({});

  const fetchEventDates = async (filter = false) => {
    try {
      const eventsRef = collection(db, "events");
      let q = query(eventsRef);

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
            selectedColor: "blue",
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
    fetchEventDates();
  }, []);

  const fetchAllEvents = async () => {
    try {
      const eventsRef = collection(db, "events");
      const querySnapshot = await getDocs(query(eventsRef));
      const events = [];

      querySnapshot.forEach((doc) => {
        const eventData = doc.data();
        events.push({
          ...eventData,
          id: doc.id,
        });
      });

      setResults(events);
      setFilteredResults(events);
    } catch (error) {
      console.error("Error fetching all events: ", error);
      Alert.alert("エラー", "イベントの取得中にエラーが発生しました");
    }
  };

  const onDayPress = (day) => {
    const date = day.dateString;

    setSelectedDates((prevSelectedDates) => {
      const updatedDates = { ...prevSelectedDates };

      if (updatedDates[date]) {
        delete updatedDates[date];
      } else {
        updatedDates[date] = {
          selected: true,
          selectedColor: "green",
        };
      }

      if (Object.keys(updatedDates).length > 0) {
        fetchEventsForDates(Object.keys(updatedDates));
      } else {
        setResults([]);
      }

      return updatedDates;
    });
  };

  const fetchEventsForDates = async (dates) => {
    try {
      const eventsRef = collection(db, "events");
      let allEvents = [];

      for (const date of dates) {
        let q = query(eventsRef, where("date", "==", date));

        if (searchName) {
          q = query(q, where("name", "==", searchName));
        }
        if (searchCost) {
          q = query(q, where("cost", "==", parseInt(searchCost, 10)));
        }

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          const eventData = doc.data();
          allEvents.push({
            ...eventData,
            id: doc.id,
          });
        });
      }

      setResults(allEvents);

      if (allEvents.length === 0) {
        Alert.alert("結果なし", "選択した日付のイベントはありません");
      }
    } catch (error) {
      console.error("Error fetching events for dates: ", error);
      Alert.alert("エラー", "イベントの取得中にエラーが発生しました");
    }
  };

  const handleSearch = async () => {
    if (!searchName && !searchCost && Object.keys(selectedDates).length === 0) {
      Alert.alert("エラー", "少なくとも1つの条件を入力してください");
      return;
    }

    try {
      const eventsRef = collection(db, "events");
      const selectedDatesList = Object.keys(selectedDates);

      if (selectedDatesList.length > 0) {
        fetchEventsForDates(selectedDatesList);
        return;
      }

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
        matchedEvents.push({
          ...eventData,
          id: doc.id,
        });

        if (eventData.date) {
          matchedDates[eventData.date] = {
            marked: true,
            dotColor: "blue",
          };
        }
      });

      setResults(matchedEvents);
      setFilteredResults(matchedEvents);
      setMarkedDates(matchedDates);

      if (matchedEvents.length === 0) {
        Alert.alert("結果なし", "条件に一致する新歓が見つかりませんでした");
      }
    } catch (error) {
      console.error("Error searching events: ", error);
      Alert.alert("エラー", "検索中にエラーが発生しました");
    }
  };

  const navigateToDetail = (item) => {
    navigation.navigate("ShinkanDetail", {
      shinkanId: item.id,
    });
  };

  return (
    <FlatList
      style={styles.container}
      data={results}
      keyExtractor={(item, index) => item.id || index.toString()}
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
              fetchEventDates(true);
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
        <TouchableOpacity
          style={styles.resultItemContainer}
          onPress={() => navigateToDetail(item)}
        >
          <Text style={styles.resultItem}>
            {item.name} - {item.date} - ¥{item.cost}
          </Text>
          <Text style={styles.viewDetailText}>詳細を見る</Text>
        </TouchableOpacity>
      )}
      ListEmptyComponent={
        <Text style={styles.emptyResult}>表示するイベントがありません</Text>
      }
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
  resultItemContainer: {
    backgroundColor: "#fff",
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  resultItem: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  viewDetailText: {
    fontSize: 14,
    color: "#3b82f6",
    textAlign: "right",
    fontWeight: "500",
  },
  emptyResult: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
});

export default Search;