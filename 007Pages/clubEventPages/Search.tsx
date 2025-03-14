import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Button, ScrollView, Modal } from "react-native";
import RNPickerSelect from 'react-native-picker-select';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Calendar } from 'react-native-calendars';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../006Configs/firebaseConfig";

interface Event {
  id: string;
  title: string;
  description: string;
  eventDate: Date;
  cost: number;
}

const EventSearch: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const options = [
    { label: "サークルA", value: "サークルA" },
    { label: "サークルB", value: "サークルB" },
    { label: "サークルC", value: "サークルC" }
  ];
  const [minCost, setMinCost] = useState("");
  const [maxCost, setMaxCost] = useState("");

  const onDayPress = (day: any) => {
    const dateStr = day.dateString;
    setSelectedDates((prevDates) =>
      prevDates.includes(dateStr)
        ? prevDates.filter((date) => date !== dateStr)
        : [...prevDates, dateStr]
    );
  };

  const fetchEvents = async () => {
    const eventsRef = collection(db, "events");
    const conditions = [];

    if (selectedDates.length > 0) {
      const startOfDay = new Date(selectedDates[0]);
      const endOfDay = new Date(selectedDates[selectedDates.length - 1]);
      endOfDay.setHours(23, 59, 59, 999);

      conditions.push(where("eventDate", ">=", startOfDay));
      conditions.push(where("eventDate", "<=", endOfDay));
    }

    if (searchText) {
      conditions.push(where("title", ">=", searchText));
      conditions.push(where("title", "<=", searchText + '\uf8ff'));
    }

    if (minCost) {
      conditions.push(where("cost", ">=", parseInt(minCost)));
    }
    if (maxCost) {
      conditions.push(where("cost", "<=", parseInt(maxCost)));
    }

    const q =
      conditions.length > 0 ? query(eventsRef, ...conditions) : query(eventsRef);
    const querySnapshot = await getDocs(q);
    let eventsList: Event[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      eventsList.push({
        id: doc.id,
        title: data.title,
        description: data.description,
        eventDate: data.eventDate.toDate(),
        cost: data.cost,
      });
    });

    if (searchText) {
      eventsList = eventsList.filter((event) =>
        event.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    eventsList = eventsList.sort(() => Math.random() - 0.5);

    setEvents(eventsList);
  };

  useEffect(() => {
    if (searchTriggered) {
      fetchEvents();
      setSearchTriggered(false);
    }
  }, [searchTriggered]);

  const handleSearch = () => {
    setSearchTriggered(true);
    setShowSearchModal(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setShowSearchModal(true)} style={styles.searchTabButton}>
        <Text style={styles.searchTabButtonText}>検索タブ</Text>
        <View style={styles.hamburgerIcon}>
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
        </View>
      </TouchableOpacity>
      <Modal
        visible={showSearchModal}
        animationType="slide"
        onRequestClose={() => setShowSearchModal(false)}
      >
        <ScrollView style={styles.modalContainer}>
          <TouchableOpacity onPress={() => setShowSearchModal(false)} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>閉じる</Text>
          </TouchableOpacity>
          <Text style={styles.title}>新歓イベント検索</Text>
          <Text style={styles.normalstring}>部活動/サークル検索
          </Text>
          <View style={styles.inputContainer}>
            <View style={styles.textInputWrapper}>
              <TextInput
                value={searchText}
                onChangeText={setSearchText}
                style={styles.textInputWithIcon}
              />
            </View>
            <Text style={styles.normalstring}>活動タイプ</Text>
            {/* RNPickerSelect を View でラップしてタッチ領域を全体に拡大 */}
            <View style={pickerSelectStyles.viewContainer}>
              <RNPickerSelect
                onValueChange={setSelectedOption}
                items={options}
                placeholder={{ label: "活動タイプを選択", value: null }}
                style={{
                  inputIOS: pickerSelectStyles.inputIOS,
                  inputAndroid: pickerSelectStyles.inputAndroid,
                  // iconContainer を全領域カバーするよう修正
                  iconContainer: pickerSelectStyles.iconContainer,
                }}
                value={selectedOption}
                useNativeAndroidPickerStyle={false}
                Icon={() => (
                  <View style={pickerSelectStyles.touchableIcon} />
                )}
              />
            </View>
            <Text style={styles.normalstring}>費用</Text>
            <View style={styles.costInputContainer}>
              <TextInput
                placeholder="最小費用"
                value={minCost}
                onChangeText={setMinCost}
                keyboardType="numeric"
                style={styles.costInput}
              />
              <Text style={styles.costInputSeparator}>〜</Text>
              <TextInput
                placeholder="最大費用"
                value={maxCost}
                onChangeText={setMaxCost}
                keyboardType="numeric"
                style={styles.costInput}
              />
            </View>
            <Text style={styles.normalstring}>日付選択(複数選択可)</Text>
            <Calendar
              onDayPress={onDayPress}
              markedDates={selectedDates.reduce((acc, date) => {
                acc[date] = { selected: true, marked: true, selectedColor: 'blue' };
                return acc;
              }, {} as { [key: string]: { selected: boolean; marked: boolean; selectedColor: string } })}
            />
          </View>
          <Button title="検索" onPress={handleSearch} />
        </ScrollView>
      </Modal>
      <ScrollView style={{ marginTop: 20 }}>
        {events.length > 0 ? (
          events.map((event) => (
            <View key={event.id} style={styles.eventContainer}>
              <View style={styles.eventTitleContainer}>
                <Text style={styles.eventTitle}>{event.title}</Text>
              </View>
              <Text>{event.description}</Text>
              <Text>{event.eventDate.toLocaleString()}</Text>
              <Text>{event.cost}円</Text>
            </View>
          ))
        ) : (
          <View style={styles.centeredContainer}>
            <Text style={styles.NotFind}>条件に該当する新歓イベントは見つかりませんでした。</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default EventSearch;

const pickerSelectStyles = StyleSheet.create({
  viewContainer: {
    height: 40, // 固定の高さを設定
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 4,
    justifyContent: 'center',
    paddingHorizontal: 10, // 左右の余白を均一に
  },
  inputIOS: {
    fontSize: 20,
    color: 'black',
  },
  inputAndroid: {
    fontSize: 16,
    color: 'black',
  },
  iconContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  touchableIcon: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
});

const styles = StyleSheet.create({
  title: { fontSize: 30, fontWeight: "bold", marginBottom: 10 },
  container: { backgroundColor: "#fff", padding: 10, flex: 1 },
  searchTabButton: { width: '100%', padding: 10, backgroundColor: "#eee", flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  searchTabButtonText: { fontSize: 16 },
  hamburgerIcon: { width: 20, height: 20, justifyContent: 'space-between' },
  hamburgerLine: { width: '100%', height: 2, backgroundColor: '#000' },
  modalContainer: { backgroundColor: "#fff", padding: 20, flex: 1 },
  closeButton: { alignSelf: 'flex-end', padding: 10, backgroundColor: "#eee", borderRadius: 4 },
  closeButtonText: { fontSize: 16 },
  inputContainer: { marginBottom: 10 },
  textInputWrapper: { marginTop: 10, position: 'relative', justifyContent: 'center', height: 40 },
  textInputWithIcon: { borderWidth: 1, borderColor: "#000", padding: 8, borderRadius: 4, flex: 1, fontSize: 20 },
  costInputContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  costInput: { flex: 1, borderWidth: 1, borderColor: "#000", padding: 8, borderRadius: 4, fontSize: 20 },
  costInputSeparator: { marginHorizontal: 10, fontSize: 20 },
  normalstring: { marginTop: 10, fontSize: 20 },
  eventContainer: { marginBottom: 15, padding: 10, borderWidth: 1, borderColor: "#ddd", borderRadius: 4 },
  eventTitle: { fontWeight: "bold", marginBottom: 5 },
  eventTitleContainer: { flexDirection: 'row', alignItems: 'center' },
  centeredContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 200 },
  NotFind: { fontSize: 20, textAlign: 'center' },
});