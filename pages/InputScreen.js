import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  Alert,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import RNPickerSelect from "react-native-picker-select";
import DateTimePicker from "@react-native-community/datetimepicker";
import { submitDataToFirestore } from "../backend";
import { uploadImageToFirebase } from "../backend/photoUploadMethods";

const InputScreen = () => {
  const [textInput, setTextInput] = useState("");
  const [longTextInput, setLongTextInput] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedRadioButton, setSelectedRadioButton] = useState("");
  const [selectedListButtons, setSelectedListButtons] = useState([]);
  const [starRating, setStarRating] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imgURL, setImgURL] = useState(null); // 画像のURLを保存

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleListButtonPress = (value) => {
    if (selectedListButtons.includes(value)) {
      setSelectedListButtons(
        selectedListButtons.filter((item) => item !== value)
      );
    } else {
      setSelectedListButtons([...selectedListButtons, value]);
    }
  };

  const handleSubmit = async () => {
    if (
      !textInput ||
      !selectedOption ||
      !selectedDate ||
      !selectedRadioButton ||
      selectedListButtons.length === 0 ||
      starRating === 0 ||
      !imgURL // 画像のURLが設定されているか確認
    ) {
      Alert.alert("全てのフィールドを入力してください");
      return;
    }

    const data = {
      textInput,
      longTextInput,
      selectedOption,
      selectedDate,
      selectedRadioButton,
      selectedListButtons,
      starRating,
      imgURL,
    };

    // コレクション名を "useee" に指定
    const collectionName = "useee"; // ここでコレクション名を指定
    await submitDataToFirestore(data, collectionName);
    Alert.alert("送信が完了しました");

    setTextInput("");
    setLongTextInput("");
    setSelectedOption(null);
    setSelectedDate(new Date());
    setSelectedRadioButton("");
    setSelectedListButtons([]);
    setStarRating(0);
    setImgURL(null);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      Alert.alert("画像が選択されていません");
      return;
    }
    try {
      const url = await uploadImageToFirebase(selectedImage);
      Alert.alert("画像がアップロードされました: " + url);
      setImgURL(url); // アップロード後にURLを設定
      setSelectedImage(null); // アップロード後にリセット
    } catch (error) {
      Alert.alert("アップロード中にエラーが発生しました: " + error.message);
    }
  };

  return (
    <ScrollView>
      <Text>文字を入力:</Text>
      <TextInput
        style={{ borderColor: "gray", borderWidth: 1, marginBottom: 20 }}
        placeholder="テキストを入力"
        value={textInput}
        onChangeText={setTextInput}
      />
      <Text>長文を入力:</Text>
      <TextInput
        style={{
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 20,
          height: 100,
          textAlignVertical: "top",
        }}
        placeholder="長文を入力"
        value={longTextInput}
        onChangeText={(text) => setLongTextInput(text)}
        multiline
      />
      <Text>文字数: {longTextInput.length}</Text>
      <Text>オプションを選択:</Text>
      <RNPickerSelect
        onValueChange={(value) => setSelectedOption(value)}
        items={[
          { label: "Option 1", value: "option1" },
          { label: "Option 2", value: "option2" },
          { label: "Option 3", value: "option3" },
        ]}
      />
      <Text>日付を選択:</Text>
      <View style={{ marginBottom: 20 }}>
        <Button title="日付を選択" onPress={() => setShowDatePicker(true)} />
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
        <Text>選択された日付: {selectedDate.toDateString()}</Text>
      </View>
      <Text>ラジオボタンを選択:</Text>
      <View style={{ flexDirection: "row", marginBottom: 20 }}>
        {["ラジオ1", "ラジオ2", "ラジオ3"].map((label, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedRadioButton(label)}
            style={{
              padding: 10,
              backgroundColor:
                selectedRadioButton === label ? "lightblue" : "white",
              borderWidth: 1,
              borderColor: "gray",
              marginHorizontal: 5,
            }}
          >
            <Text>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text>リストボタンを選択:</Text>
      <View style={{ flexDirection: "column", marginBottom: 20 }}>
        {["リスト1", "リスト2", "リスト3"].map((label, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleListButtonPress(label)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 10,
              backgroundColor: selectedListButtons.includes(label)
                ? "lightblue"
                : "white",
              borderWidth: 1,
              borderColor: "gray",
              marginVertical: 5,
            }}
          >
            <Text style={{ marginRight: 10 }}>
              {selectedListButtons.includes(label) ? "●" : "○"}
            </Text>
            <Text>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text>評価を選択:</Text>
      <View style={{ flexDirection: "row", marginBottom: 20 }}>
        {[1, 2, 3, 4, 5].map((rating) => (
          <TouchableOpacity
            key={rating}
            onPress={() => setStarRating(rating)}
            style={{ marginHorizontal: 5 }}
          >
            <Text
              style={{
                fontSize: 30,
                color: rating <= starRating ? "gold" : "gray",
              }}
            >
              ★
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View>
        <Button title="写真を選択" onPress={pickImage} />
        {selectedImage && (
          <>
            <Image source={{ uri: selectedImage }} style={styles.image} />
            <Button title="アップロード" onPress={handleUpload} />
          </>
        )}
        {!selectedImage && <Text>画像が選択されていません</Text>}
      </View>
      <Button title="送信" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
});

export default InputScreen;
