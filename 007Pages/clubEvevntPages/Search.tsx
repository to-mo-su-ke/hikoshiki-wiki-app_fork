// import React, { useState, useEffect } from "react";
// import { View, Text, TextInput, StyleSheet, TouchableOpacity, Button, Image, ScrollView, Modal } from "react-native";
// import RNPickerSelect from 'react-native-picker-select';
// import { Calendar } from 'react-native-calendars';
// import { collection, query, where, getDocs } from "firebase/firestore";
// import { db } from "../../006Configs/firebaseConfig2";
// import { useNavigation } from "@react-navigation/native";

// interface Event {
//   id: string;
//   title: string;
//   description: string;
//   // Firestore Timestamp を Date に変換する前提
//   eventDate: Date;
//   cost: number;
//     location: string;
//     name: string;
//     explain: string;

// }

// const EventSearch: React.FC = () => {
//   const navigation = useNavigation();
//   const [searchText, setSearchText] = useState("");
//   const [selectedDates, setSelectedDates] = useState<string[]>([]);
//   const [events, setEvents] = useState<Event[]>([]);
//   const [searchTriggered, setSearchTriggered] = useState(false);
  
//   // 追加：検索タブ全体を隠すための状態
//   const [showSearchModal, setShowSearchModal] = useState(false);
//   const [selectedOption, setSelectedOption] = useState("");
//   const options = [
//     { label: "サークルA", value: "サークルA" },
//     { label: "サークルB", value: "サークルB" },
//     { label: "サークルC", value: "サークルC" }
//   ]; // 必要に応じて変更

//   // 追加：費用の範囲を入力するための状態
//   const [minCost, setMinCost] = useState("");
//   const [maxCost, setMaxCost] = useState("");

//   const onDayPress = (day: any) => {
//     const dateStr = day.dateString;
//     setSelectedDates((prevDates) =>
//       prevDates.includes(dateStr)
//         ? prevDates.filter((date) => date !== dateStr)
//         : [...prevDates, dateStr]
//     );
//   };

//   const fetchEvents = async () => {
//     try {
//       // 実際の環境では 'events' ではなく 'shinkantest' コレクションを使用
//       const eventsRef = collection(db, "shinkantest");
//       const conditions = [];

//       // 選択された日付に基づいてクエリを作成
//       if (selectedDates.length > 0) {
//         const startOfDay = new Date(selectedDates[0]);
//         const endOfDay = new Date(selectedDates[selectedDates.length - 1]);
//         endOfDay.setHours(23, 59, 59, 999);

//         conditions.push(where("eventDate", ">=", startOfDay));
//         conditions.push(where("eventDate", "<=", endOfDay));
//       }

//       // 検索テキストがある場合、タイトルの部分一致でフィルタ
//       if (searchText) {
//         conditions.push(where("name", ">=", searchText));
//         conditions.push(where("name", "<=", searchText + '\uf8ff'));
//       }

//       // 費用の範囲が指定されている場合、費用でフィルタ
//       if (minCost) {
//         conditions.push(where("cost", ">=", parseInt(minCost)));
//       }
//       if (maxCost) {
//         conditions.push(where("cost", "<=", parseInt(maxCost)));
//       }

//       // 条件によってクエリを作成
//       const q =
//         conditions.length > 0 ? query(eventsRef, ...conditions) : query(eventsRef);
//       const querySnapshot = await getDocs(q);
      
//       let eventsList: any[] = [];
//       querySnapshot.forEach((doc) => {
//         const data = doc.data();
//         eventsList.push({
//           id: doc.id,
//           name: data.name || "無題の新歓",
//           explain: data.explain || "説明なし",
//           // eventDate が存在しない場合の処理
//           eventDate: data.eventDate ? data.eventDate.toDate() : new Date(),
//           cost: data.cost || 0,
//           location: data.location || "場所未定",
//         });
//       });

//       // クライアント側で「contains」検索を実施
//       if (searchText) {
//         eventsList = eventsList.filter((event) =>
//           event.name.toLowerCase().includes(searchText.toLowerCase())
//         );
//       }

//       // ランダムな順番に並べ替え
//       eventsList = eventsList.sort(() => Math.random() - 0.5);

//       setEvents(eventsList);
//     } catch (error) {
//       console.error("イベント検索エラー:", error);
//     }
//   };

//   useEffect(() => {
//     if (searchTriggered) {
//       fetchEvents();
//       setSearchTriggered(false);
//     }
//   }, [searchTriggered]);

//   // コンポーネントがマウントされたときに初期検索を行う
//   useEffect(() => {
//     fetchEvents();
//   }, []);

//   const handleSearch = () => {
//     setSearchTriggered(true);
//     setShowSearchModal(false);
//   // };

//   // 新歓詳細ページへ遷移する関数
//   const navigateToDetail = (shinkanId: string) => {
//     navigation.navigate('ShinkanDetail', { shinkanId });
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity onPress={() => setShowSearchModal(true)} style={styles.searchTabButton}>
//         <Text style={styles.searchTabButtonText}>検索タブ</Text>
//         <View style={styles.hamburgerIcon}>
//           <View style={styles.hamburgerLine} />
//           <View style={styles.hamburgerLine} />
//           <View style={styles.hamburgerLine} />
//         </View>
//       </TouchableOpacity>
      
//       <Modal
//         visible={showSearchModal}
//         animationType="slide"
//         onRequestClose={() => setShowSearchModal(false)}
//       >
//         <ScrollView style={styles.modalContainer}>
//           <TouchableOpacity onPress={() => setShowSearchModal(false)} style={styles.closeButton}>
//             <Text style={styles.closeButtonText}>閉じる</Text>
//           </TouchableOpacity>
//           <Text style={styles.normalstring}>新歓イベント検索</Text>
//           <View style={styles.inputContainer}>
//             <View style={styles.textInputWrapper}>
//               <TextInput
//                 placeholder="部活動/サークル検索"
//                 value={searchText}
//                 onChangeText={setSearchText}
//                 style={styles.textInputWithIcon}
//               />
//             </View>
//             <Text style={styles.normalstring}>活動タイプ</Text>
//             <TouchableOpacity style={styles.pickerButton}>
//               <RNPickerSelect
//                 onValueChange={(value) => setSelectedOption(value)}
//                 items={options}
//                 style={pickerSelectStyles}
//                 value={selectedOption}
//                 useNativeAndroidPickerStyle={false}
//                 placeholder={{ label: "活動タイプを選択", value: null }}
//               />
//             </TouchableOpacity>
//             <Text style={styles.normalstring}>費用</Text>
//             <View style={styles.costInputContainer}>
//               <TextInput
//                 placeholder="最小費用"
//                 value={minCost}
//                 onChangeText={setMinCost}
//                 keyboardType="numeric"
//                 style={styles.costInput}
//               />
//               <Text style={styles.costInputSeparator}>〜</Text>
//               <TextInput
//                 placeholder="最大費用"
//                 value={maxCost}
//                 onChangeText={setMaxCost}
//                 keyboardType="numeric"
//                 style={styles.costInput}
//               />
//             </View>
//             <Text style={styles.normalstring}>日付選択(複数選択可)</Text>
//             <Calendar
//               onDayPress={onDayPress}
//               markedDates={selectedDates.reduce((acc, date) => {
//                 acc[date] = { selected: true, marked: true, selectedColor: 'blue' };
//                 return acc;
//               }, {} as { [key: string]: { selected: boolean; marked: boolean; selectedColor: string } })}
//             />
//           </View>
//           <Button title="検索" onPress={handleSearch} />
//         </ScrollView>
//       </Modal>
      
//       <ScrollView style={{ marginTop: 20 }}>
//         {events.length > 0 ? (
//           events.map((event) => (
//             <TouchableOpacity 
//               key={event.id} 
//               style={styles.eventContainer}
//               onPress={() => navigateToDetail(event.id)}
//             >
//               <View style={styles.eventTitleContainer}>
//                 <Text style={styles.eventTitle}>{event.name}</Text>
//               </View>
//               <Text style={styles.eventDescription}>{event.explain}</Text>
//               <Text style={styles.eventInfo}>日程: {event.eventDate.toLocaleDateString()}</Text>
//               <Text style={styles.eventInfo}>参加費: {event.cost}円</Text>
//               <Text style={styles.eventInfo}>場所: {event.location}</Text>
//               <Text style={styles.viewDetailsText}>タップして詳細を表示</Text>
//             </TouchableOpacity>
//           ))
//         ) : (
//           <View style={styles.centeredContainer}>
//             <Text style={styles.NotFind}>条件に該当する新歓イベントは見つかりませんでした。</Text>
//           </View>
//         )}
//       </ScrollView>
//     </View>
//   );
// };

// export default EventSearch;

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: "#fff",
//     padding: 10,
//     flex: 1,
//   },
//   searchTabButton: {
//     width: '100%',
//     padding: 10,
//     backgroundColor: "#eee",
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   searchTabButtonText: {
//     fontSize: 16,
//   },
//   hamburgerIcon: {
//     width: 20,
//     height: 20,
//     justifyContent: 'space-between',
//   },
//   hamburgerLine: {
//     width: '100%',
//     height: 2,
//     backgroundColor: '#000',
//   },
//   modalContainer: {
//     backgroundColor: "#fff",
//     padding: 20,
//     flex: 1,
//   },
//   closeButton: {
//     alignSelf: 'flex-end',
//     padding: 10,
//     backgroundColor: "#eee",
//     borderRadius: 4,
//   },
//   closeButtonText: {
//     fontSize: 16,
//   },
//   inputContainer: {
//     marginBottom: 10,
//   },
//   textInputWrapper: {
//     marginTop: 10,
//     position: 'relative',
//     justifyContent: 'center',
//     height: 40,
//   },
//   fixedSearchIcon: {
//     position: 'absolute',
//     left: 10,
//     width: 16,
//     height: 16,
//     resizeMode: 'contain',
//     zIndex: 1,
//   },
//   textInputWithIcon: {
//     borderWidth: 1,
//     borderColor: "#000",
//     padding: 8,
//     borderRadius: 4,
//     flex: 1,
//     fontSize: 20,  // フォントサイズを調整（必要に応じて）
//   },
//   // 費用入力フィールドのスタイル
//   costInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   costInput: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: "#000",
//     padding: 8,
//     borderRadius: 4,
//     fontSize: 20,
//   },
//   costInputSeparator: {
//     marginHorizontal: 10,
//     fontSize: 20,
//   },
//   // Pickerのスタイル
//   pickerButton: {
//     marginTop: 10,
//     padding: 10,
//     backgroundColor: "#fff",
//     borderRadius: 4,
//     borderWidth: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   pickerButtonText: {
//     fontSize: 16,
//     flex: 1,
//   },
//   // 以下、その他のスタイルはそのまま
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   textInput: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     padding: 8,
//     borderRadius: 4,
//     flex: 1,
//   },
//   dropdownButton: {
//     marginTop: 10,
//     padding: 10,
//     backgroundColor: "#fff",
//     borderRadius: 4,
//     borderWidth: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   dropdownButtonText: {
//     fontSize: 16,
//     flex: 1,
//   },
//   dropdownArrow: {
//     fontSize: 16,
//     marginLeft: 10,
//   },
//   dropdownOptions: {
//     backgroundColor: "#fff",
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 4,
//     marginTop: 0,
//     position: 'relative',
//     zIndex: 1,
//     width: '100%',
//   },
//   dropdownItem: {
//     padding: 10,
//   },
//   dropdownItemText: {
//     fontSize: 16,
//   },
//   normalstring: {
//     marginTop: 10,
//     fontSize: 20,
//   },
//   // 既存のスタイル
//   eventContainer: {
//     marginBottom: 15,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 8,
//     backgroundColor: '#fff',
//   },
//   eventTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 8,
//     color: '#333',
//   },
//   eventDescription: {
//     fontSize: 16,
//     marginBottom: 8,
//     color: '#444',
//   },
//   eventInfo: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 4,
//   },
//   viewDetailsText: {
//     fontSize: 14,
//     color: '#4CAF50',
//     fontWeight: 'bold',
//     marginTop: 8,
//     textAlign: 'right',
//   },
//   datePicker: {
//     width: '100%',
//   },
//   selectedDatesContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginTop: 10,
//   },
//   selectedDate: {
//     backgroundColor: '#ddd',
//     padding: 5,
//     borderRadius: 4,
//     margin: 5,
//   },
//   selectedDateText: {
//     color: '#333',
//   },
//   eventTitleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   centeredContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 200, // 上部に余白を追加
//   },
//   NotFind: {
//     fontSize: 20,
//     textAlign: 'center',
//   },
// });

// const pickerSelectStyles = StyleSheet.create({
//   inputIOS: {
//     fontSize: 16,
//     paddingVertical: 12,
//     paddingHorizontal: 10,
//     borderWidth: 1,
//     borderColor: 'gray',
//     borderRadius: 4,
//     color: 'black',
//     paddingRight: 30, // to ensure the text is never behind the icon
//   },
//   inputAndroid: {
//     fontSize: 16,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     borderWidth: 0.5,
//     borderColor: 'purple',
//     borderRadius: 8,
//     color: 'black',
//     paddingRight: 30, // to ensure the text is never behind the icon
//   },
// });