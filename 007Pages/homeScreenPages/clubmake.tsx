import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Button, Alert, StyleSheet } from "react-native";
import { submitDataToFirestore, checkDuplicateName } from "../../004BackendModules/mainMethod/submitdata";

const ClubSearchSubmit = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [isDuplicate, setIsDuplicate] = useState(false);

  const clubTypes = [
    "運動系部活",
    "文化系部活",
    "公認運動系サークル",
    "公認文化系サークル",
    "非公認運動系サークル",
    "非公認文化系サークル",
    "活動団体",
  ];
  const [selectedClubType, setSelectedClubType] = useState("");

  // 活動場所 (リストボタン: 複数選択可能)
  const activityPlaces = ["体育館", "グラウンド", "教室", "その他"];
  const [selectedActivityPlaces, setSelectedActivityPlaces] = useState([]);

  const toggleActivityPlace = (place) => {
    if (selectedActivityPlaces.includes(place)) {
      setSelectedActivityPlaces(selectedActivityPlaces.filter((item) => item !== place));
    } else {
      setSelectedActivityPlaces([...selectedActivityPlaces, place]);
    }
  };

  const handleSubmit = async () => {
    if (!searchText || !selectedClubType || selectedActivityPlaces.length === 0) {
      Alert.alert("全てのフィールドを入力してください");
      return;
    }

    if (searchText.length > 30) {
      Alert.alert("部活名は30文字以内で入力してください");
      return;
    }

    const isNameDuplicate = await checkDuplicateName(searchText, "clubtest");
    if (isNameDuplicate) {
      setIsDuplicate(true);
      Alert.alert("同じ名前の部活が既に存在します");
      return;
    }

    const data = {
      searchText,
      selectedClubType,
      selectedActivityPlaces,
    };

    const collectionName = "clubtest"; // 必要に応じて変更してください

    try {
      await submitDataToFirestore(data, collectionName);
      Alert.alert("送信が完了しました");
      // navigation.goBack(); // 必要に応じてナビゲーション処理を追加
    } catch (error) {
      console.error("送信エラー：", error);
      Alert.alert("送信に失敗しました");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>部活名 (検索ワード)</Text>
      <TextInput
        style={styles.input}
        placeholder="部活名を入力"
        value={searchText}
        onChangeText={setSearchText}
        maxLength={30}
      />

      {isDuplicate && (
        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>同じ名前の部活が既に存在します</Text>
          <Button title="ダミーの遷移ボタン" onPress={() => Alert.alert("ダミーの遷移")} />
        </View>
      )}

      <Text style={styles.label}>部活種別を選択 (ラジオボタン)</Text>
      <View style={styles.radioGroup}>
        {clubTypes.map((type, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedClubType(type)}
            style={[
              styles.radioButton,
              selectedClubType === type && styles.radioButtonSelected,
            ]}
          >
            <Text style={styles.radioText}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>活動場所を選択 (リストボタン、複数選択可)</Text>
      <View style={styles.listGroup}>
        {activityPlaces.map((place, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => toggleActivityPlace(place)}
            style={[
              styles.listButton,
              selectedActivityPlaces.includes(place) && styles.listButtonSelected,
            ]}
          >
            <Text style={styles.listButtonText}>
              {selectedActivityPlaces.includes(place) ? "● " : "○ "}
              {place}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button title="送信" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    padding: 8,
    marginTop: 8,
  },
  radioGroup: {
    flexDirection: "column",
    marginTop: 8,
  },
  radioButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    marginVertical: 4,
  },
  radioButtonSelected: {
    backgroundColor: "lightblue",
  },
  radioText: {
    fontSize: 14,
  },
  listGroup: {
    flexDirection: "column",
    marginTop: 8,
  },
  listButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    marginVertical: 4,
  },
  listButtonSelected: {
    backgroundColor: "lightblue",
  },
  listButtonText: {
    fontSize: 14,
  },
  warningContainer: {
    marginTop: 16,
    padding: 10,
    backgroundColor: "lightyellow",
    borderRadius: 4,
  },
  warningText: {
    color: "red",
    fontWeight: "bold",
  },
});

export default ClubSearchSubmit;