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
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  Search: undefined;
  SearchDetail: { eventId: string }; // SearchDetail に渡すパラメータを定義
};

const Search = () => {
  const [searchName, setSearchName] = useState("");
  const [searchCost, setSearchCost] = useState("");
  const [results, setResults] = useState([]);
  const [selectedDates, setSelectedDates] = useState({});
  const [markedDates, setMarkedDates] = useState({});
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, "Search">>();

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
            marked: true,
            dotColor: filter ? "blue" : "red",
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

  const onDayPress = async (day) => {
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

    // 選択されたすべての日付の新歓を検索
    try {
      const selectedDateKeys = Object.keys(selectedDates);
      const datesToQuery = selectedDateKeys.includes(date)
        ? selectedDateKeys
        : [...selectedDateKeys, date];

      if (datesToQuery.length === 0) {
        setResults([]);
        return;
      }

      const eventsRef = collection(db, "events");
      const q = query(eventsRef, where("date", "in", datesToQuery));
      const querySnapshot = await getDocs(q);
      const matchedEvents = [];

      querySnapshot.forEach((doc) => {
        matchedEvents.push({ id: doc.id, ...doc.data() });
      });

      setResults(matchedEvents);

      if (matchedEvents.length === 0) {
        Alert.alert("結果なし", "選択した日付に新歓が見つかりませんでした");
      }
    } catch (error) {
      console.error("Error fetching events for selected dates: ", error);
      Alert.alert("エラー", "選択した日付のイベント取得中にエラーが発生しました");
    }
  };

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
        matchedEvents.push({ id: doc.id, ...eventData });

        if (eventData.date) {
          matchedDates[eventData.date] = {
            marked: true,
            dotColor: "blue",
          };
        }
      });

      setResults(matchedEvents);
      setMarkedDates(matchedDates);

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
      keyExtractor={(item) => item.id} // 一意のキーを設定
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
          <Text style={styles.label}>日程</Text>
          <Calendar
            onDayPress={onDayPress}
            markedDates={{
              ...markedDates,
              ...selectedDates,
            }}
          />
          <Text style={styles.resultTitle}>検索結果</Text>
        </View>
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => navigation.navigate("SearchDetail", { eventId: item.id })}
        >
          <Text style={styles.resultItem}>
            {item.name} 
          </Text>
        </TouchableOpacity>
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