import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Button, Alert, StyleSheet, ScrollView, Image } from "react-native";
import * as ImagePicker from "expo-image-picker"; // 追加: ImagePickerのインポート
import { submitDataToFirestore, checkDuplicateName } from "../../../004BackendModules/mainMethod/submitdata";
import { uploadPhotoToFirestore } from "../../../004BackendModules/mainMethod/uploadPhoto";

const ClubSearchSubmit = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [isMissingField, setIsMissingField] = useState(false);
  const [clubDetail, setClubDetail] = useState("");
  const [appealPoint, setAppealPoint] = useState("");
  const [badPoint, setBadPoint] = useState("");
  const [membersNumber, setMembersNumber] = useState("");
  const [searchTags, setSearchTags] = useState([]);
  const [searchTagsDropdownVisible, setSearchTagsDropdownVisible] = useState(false);
  const [activityIntensity, setActivityIntensity] = useState("");
  const [activityIntensityDropdownVisible, setActivityIntensityDropdownVisible] = useState(false);
  const [selectedActivityFrequency, setSelectedActivityFrequency] = useState("");
  const [activityFrequencyDropdownVisible, setActivityFrequencyDropdownVisible] = useState(false);

  // 連絡先グループ (任意)
  const [lineId, setLineId] = useState("");
  const [lineQR, setLineQR] = useState("");
  const [instagramId, setInstagramId] = useState("");
  const [instagramQR, setInstagramQR] = useState("");
  const [twitterId, setTwitterId] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [twitterQR, setTwitterQR] = useState("");
  const [discordUrl, setDiscordUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");

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
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleDropdownToggle = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleOptionSelect = (type) => {
    setSelectedClubType(type);
    setDropdownVisible(false);
  };

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

  const [entryFee, setEntryFee] = useState("");
  const [annualFee, setAnnualFee] = useState("");
  const [requiredItems, setRequiredItems] = useState([{ name: "", price: "", description: "" }]);
  const [weeklyActivities, setWeeklyActivities] = useState([
    { day: "月", hasActivity: false, content: "", time: "" },
    { day: "火", hasActivity: false, content: "", time: "" },
    { day: "水", hasActivity: false, content: "", time: "" },
    { day: "木", hasActivity: false, content: "", time: "" },
    { day: "金", hasActivity: false, content: "", time: "" },
    { day: "土", hasActivity: false, content: "", time: "" },
    { day: "日", hasActivity: false, content: "", time: "" },
  ]);
  const [annualSchedule, setAnnualSchedule] = useState([{ month: "", eventName: "", period: "", content: "", cost: "", frequency: 1 }]);
  const [photo1, setPhoto1] = useState(null);
  const [photo2, setPhoto2] = useState(null);
  const [photo1Local, setPhoto1Local] = useState(null);
  const [photo2Local, setPhoto2Local] = useState(null);

  const handleAddRequiredItem = () => {
    setRequiredItems([...requiredItems, { name: "", price: "", description: "" }]);
  };

  const handleRemoveRequiredItem = (index) => {
    const newItems = requiredItems.filter((_, i) => i !== index);
    setRequiredItems(newItems);
  };

  const handleAddAnnualSchedule = () => {
    setAnnualSchedule([...annualSchedule, { month: "", eventName: "", period: "", content: "", cost: "", frequency: 1 }]);
  };

  const handleRemoveAnnualSchedule = (index) => {
    const newSchedule = annualSchedule.filter((_, i) => i !== index);
    setAnnualSchedule(newSchedule);
  };

  const handleSelectPhoto = async (setLocalPhoto) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      const photoUri = result.assets[0].uri;
      setLocalPhoto(photoUri);
      Alert.alert("写真が選択されました");
    }
  };

  const handleConfirm = async () => {
    if (!searchText || !selectedClubType || selectedActivityPlaces.length === 0
        || !clubDetail || !appealPoint || !badPoint || !membersNumber) {
      setIsMissingField(true);
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

    try {
      if (photo1Local) {
        const response1 = await fetch(photo1Local);
        if (!response1.ok) throw new Error("写真1のBlob変換失敗");
        const blob1 = await response1.blob();
        const downloadUrl1 = await uploadPhotoToFirestore(blob1);
        if (!downloadUrl1) throw new Error("写真1のアップロード結果が空です");
        setPhoto1(downloadUrl1);
      }
      if (photo2Local) {
        const response2 = await fetch(photo2Local);
        if (!response2.ok) throw new Error("写真2のBlob変換失敗");
        const blob2 = await response2.blob();
        const downloadUrl2 = await uploadPhotoToFirestore(blob2);
        if (!downloadUrl2) throw new Error("写真2のアップロード結果が空です");
        setPhoto2(downloadUrl2);
      }
    } catch (error) {
      Alert.alert("写真のアップロードに失敗しました: " + error.message);
      return;
    }

    const data = {
      searchText,
      selectedClubType,
      selectedActivityPlaces,
      clubDetail,
      appealPoint,
      badPoint,
      membersNumber,
      searchTags,
      activityIntensity,
      selectedActivityFrequency,
      lineId,
      lineQR,
      instagramId,
      instagramQR,
      twitterId,
      twitterUrl,
      twitterQR,
      discordUrl,
      websiteUrl,
      entryFee,
      annualFee,
      requiredItems,
      weeklyActivities,
      annualSchedule,
      photo1: photo1Local,
      photo2: photo2Local,
    };

    navigation.navigate("clubmake2", { formData: data });
  };

  return (
    <ScrollView style={styles.container}>
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
          <Text style={styles.warningText}>同じ名前の部活が既に存在します。登録済みである場合は編集ページに移動してください</Text>
          <Button title="編集画面" onPress={() => Alert.alert("編集画面")} />
        </View>
      )}
      {isMissingField && (
        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>必須項目の入力漏れがあります</Text>
        </View>
      )}

      <Text style={styles.label}>部活種別を選択 (ドロップダウン)</Text>
      <TouchableOpacity onPress={handleDropdownToggle} style={styles.dropdown}>
        <Text style={styles.dropdownText}>{selectedClubType || "部活種別を選択"}</Text>
      </TouchableOpacity>
      {dropdownVisible && (
        <View style={styles.dropdownOptions}>
          {clubTypes.map((type, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleOptionSelect(type)}
              style={styles.dropdownOption}
            >
              <Text style={styles.dropdownOptionText}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

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

      <Text style={styles.label}>部活動詳細</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="詳しく入力..."
        value={clubDetail}
        onChangeText={setClubDetail}
        multiline={true}
      />

      <Text style={styles.label}>部活動のアピールポイント</Text>
      <TextInput
        style={styles.input}
        placeholder="アピールポイント"
        value={appealPoint}
        onChangeText={setAppealPoint}
      />

      <Text style={styles.label}>部活動のバッドポイント</Text>
      <TextInput
        style={styles.input}
        placeholder="バッドポイント"
        value={badPoint}
        onChangeText={setBadPoint}
      />

      <Text style={styles.label}>所属人数</Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="例: 30"
          keyboardType="numeric"
          value={membersNumber}
          onChangeText={setMembersNumber}
        />
        <Text style={{ marginLeft: 8 }}>人</Text>
      </View>

      <Text style={styles.label}>検索用タグ</Text>
      <TouchableOpacity
        onPress={() => setSearchTagsDropdownVisible(!searchTagsDropdownVisible)}
        style={styles.dropdown}
      >
        <Text style={styles.dropdownText}>
          {searchTags.length ? searchTags.join(", ") : "タグを選択"}
        </Text>
      </TouchableOpacity>
      {searchTagsDropdownVisible && (
        <View style={styles.dropdownOptions}>
          {/* 後ほどリストを追加する想定 */}
          {/* 例: ["タグ1","タグ2","タグ3"] */}
          {/* ...existing code... */}
        </View>
      )}

      <Text style={styles.label}>活動強制度</Text>
      <TouchableOpacity
        onPress={() => setActivityIntensityDropdownVisible(!activityIntensityDropdownVisible)}
        style={styles.dropdown}
      >
        <Text style={styles.dropdownText}>
          {activityIntensity || "活動強制度を選択"}
        </Text>
      </TouchableOpacity>
      {activityIntensityDropdownVisible && (
        <View style={styles.dropdownOptions}>
          {[
            "絶対参加",
            "正当な理由で欠席可能",
            "一定以上の回数の出席は義務",
            "連絡すれば欠席可能",
            "自由参加"
          ].map((option, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setActivityIntensity(option);
                setActivityIntensityDropdownVisible(false);
              }}
              style={styles.dropdownOption}
            >
              <Text style={styles.dropdownOptionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Text style={styles.label}>連絡先(任意)</Text>

      <Text>LINE ID</Text>
      <TextInput
        style={styles.input}
        placeholder="line_id_here"
        value={lineId}
        onChangeText={setLineId}
      />
      <Button title="LINE QRをアップロード" onPress={() => handleSelectPhoto(setLineQR)} />
      {lineQR && (
        <Image source={{ uri: lineQR }} style={{ width: 100, height: 100, marginVertical: 8 }} />
      )}

      <Text>Instagram ID</Text>
      <TextInput
        style={styles.input}
        placeholder="instagram_id_here"
        value={instagramId}
        onChangeText={setInstagramId}
      />
      <Button title="Instagram QRをアップロード" onPress={() => handleSelectPhoto(setInstagramQR)} />
      {instagramQR && (
        <Image source={{ uri: instagramQR }} style={{ width: 100, height: 100, marginVertical: 8 }} />
      )}

      <Text>Twitter ID</Text>
      <TextInput
        style={styles.input}
        placeholder="twitter_id_here"
        value={twitterId}
        onChangeText={setTwitterId}
      />
      <Text>Twitter URL</Text>
      <TextInput
        style={styles.input}
        placeholder="twitter_url"
        value={twitterUrl}
        onChangeText={setTwitterUrl}
      />
      <Button title="Twitter QRをアップロード" onPress={() => handleSelectPhoto(setTwitterQR)} />
      {twitterQR && (
        <Image source={{ uri: twitterQR }} style={{ width: 100, height: 100, marginVertical: 8 }} />
      )}

      <Text>Discord URL</Text>
      <TextInput
        style={styles.input}
        placeholder="discord_url"
        value={discordUrl}
        onChangeText={setDiscordUrl}
      />
      <Text>Website URL</Text>
      <TextInput
        style={styles.input}
        placeholder="website_url"
        value={websiteUrl}
        onChangeText={setWebsiteUrl}
      />

      <Text style={styles.label}>活動頻度</Text>
      <TouchableOpacity
        onPress={() => setActivityFrequencyDropdownVisible(!activityFrequencyDropdownVisible)}
        style={styles.dropdown}
      >
        <Text style={styles.dropdownText}>
          {selectedActivityFrequency || "活動頻度を選択"}
        </Text>
      </TouchableOpacity>
      {activityFrequencyDropdownVisible && (
        <View style={styles.dropdownOptions}>
          {[
            "週1回","週2回","週3回","週4回","週5回",
            "週6回","週7回","月1回","月2回","その他"
          ].map((option, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setSelectedActivityFrequency(option);
                setActivityFrequencyDropdownVisible(false);
              }}
              style={styles.dropdownOption}
            >
              <Text style={styles.dropdownOptionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Text style={styles.label}>金銭グループ</Text>
      <Text>入会費</Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="例: 5000"
          keyboardType="numeric"
          value={entryFee}
          onChangeText={setEntryFee}
        />
        <Text style={{ marginLeft: 8 }}>円</Text>
      </View>
      <Text>年会費</Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="例: 10000"
          keyboardType="numeric"
          value={annualFee}
          onChangeText={setAnnualFee}
        />
        <Text style={{ marginLeft: 8 }}>円</Text>
      </View>

      <Text style={styles.label}>必要物品</Text>
      {requiredItems.map((item, index) => (
        <View key={index} style={styles.requiredItemContainer}>
          <TextInput
            style={styles.input}
            placeholder="物品名"
            value={item.name}
            onChangeText={(text) => {
              const newItems = [...requiredItems];
              newItems[index].name = text;
              setRequiredItems(newItems);
            }}
          />
          <TextInput
            style={styles.input}
            placeholder="値段"
            keyboardType="numeric"
            value={item.price}
            onChangeText={(text) => {
              const newItems = [...requiredItems];
              newItems[index].price = text;
              setRequiredItems(newItems);
            }}
          />
          <TextInput
            style={styles.input}
            placeholder="補足説明"
            value={item.description}
            onChangeText={(text) => {
              const newItems = [...requiredItems];
              newItems[index].description = text;
              setRequiredItems(newItems);
            }}
          />
          <Button title="-" onPress={() => handleRemoveRequiredItem(index)} />
        </View>
      ))}
      <Button title="+" onPress={handleAddRequiredItem} />

      <Text style={styles.label}>週活動内容グループ</Text>
      {weeklyActivities.map((activity, index) => (
        <View key={index} style={styles.weeklyActivityContainer}>
          <Text>{activity.day}</Text>
          <TouchableOpacity
            onPress={() => {
              const newActivities = [...weeklyActivities];
              newActivities[index].hasActivity = !newActivities[index].hasActivity;
              setWeeklyActivities(newActivities);
            }}
            style={styles.dropdown}
          >
            <Text style={styles.dropdownText}>
              {activity.hasActivity ? "有" : "無"}
            </Text>
          </TouchableOpacity>
          {activity.hasActivity && (
            <>
              <TextInput
                style={styles.input}
                placeholder="活動内容"
                value={activity.content}
                onChangeText={(text) => {
                  const newActivities = [...weeklyActivities];
                  newActivities[index].content = text;
                  setWeeklyActivities(newActivities);
                }}
              />
              <TextInput
                style={styles.input}
                placeholder="活動時間 (hh:mm)"
                value={activity.time}
                onChangeText={(text) => {
                  const newActivities = [...weeklyActivities];
                  newActivities[index].time = text;
                  setWeeklyActivities(newActivities);
                }}
              />
            </>
          )}
        </View>
      ))}

      <Text style={styles.label}>年間スケジュールグループ</Text>
      {annualSchedule.map((schedule, index) => (
        <View key={index} style={styles.annualScheduleContainer}>
          <TextInput
            style={styles.input}
            placeholder="月"
            value={schedule.month}
            onChangeText={(text) => {
              const newSchedule = [...annualSchedule];
              newSchedule[index].month = text;
              setAnnualSchedule(newSchedule);
            }}
          />
          <TextInput
            style={styles.input}
            placeholder="イベント名"
            value={schedule.eventName}
            onChangeText={(text) => {
              const newSchedule = [...annualSchedule];
              newSchedule[index].eventName = text;
              setAnnualSchedule(newSchedule);
            }}
          />
          <TextInput
            style={styles.input}
            placeholder="期間"
            value={schedule.period}
            onChangeText={(text) => {
              const newSchedule = [...annualSchedule];
              newSchedule[index].period = text;
              setAnnualSchedule(newSchedule);
            }}
          />
          <TextInput
            style={styles.input}
            placeholder="内容"
            value={schedule.content}
            onChangeText={(text) => {
              const newSchedule = [...annualSchedule];
              newSchedule[index].content = text;
              setAnnualSchedule(newSchedule);
            }}
          />
          <TextInput
            style={styles.input}
            placeholder="費用"
            keyboardType="numeric"
            value={schedule.cost}
            onChangeText={(text) => {
              const newSchedule = [...annualSchedule];
              newSchedule[index].cost = text;
              setAnnualSchedule(newSchedule);
            }}
          />
          <TextInput
            style={styles.input}
            placeholder="年あたりの回数"
            keyboardType="numeric"
            value={schedule.frequency.toString()}
            onChangeText={(text) => {
              const newSchedule = [...annualSchedule];
              newSchedule[index].frequency = parseInt(text, 10);
              setAnnualSchedule(newSchedule);
            }}
          />
          <Button title="-" onPress={() => handleRemoveAnnualSchedule(index)} />
        </View>
      ))}
      <Button title="+" onPress={handleAddAnnualSchedule} />

      <Text style={styles.label}>写真</Text>
      <Button title="写真1を選択" onPress={() => handleSelectPhoto(setPhoto1Local)} />
      {photo1Local && (
        <Image source={{ uri: photo1Local }} style={{ width: 100, height: 100, marginVertical: 8 }} />
      )}
      <Button title="写真2を選択" onPress={() => handleSelectPhoto(setPhoto2Local)} />
      {photo2Local && (
        <Image source={{ uri: photo2Local }} style={{ width: 100, height: 100, marginVertical: 8 }} />
      )}

      <Button title="確認" onPress={handleConfirm} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa", // Clubdetailと一致させた背景色
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 8,
    color: "#334155", // セクションタイトルと同じ色
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
  warningContainer: {
    marginTop: 12,
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#fee2e2",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  warningText: {
    color: "#dc2626",
    fontWeight: "500",
    fontSize: 14,
  },
  radioGroup: {
    flexDirection: "column",
    marginVertical: 8,
  },
  radioButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 12,
    marginVertical: 4,
  },
  radioButtonSelected: {
    backgroundColor: "#dbeafe",
    borderColor: "#93c5fd",
  },
  radioText: {
    fontSize: 15,
    color: "#475569",
  },
  listGroup: {
    flexDirection: "column",
    marginVertical: 8,
  },
  listButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 12,
    marginVertical: 4,
  },
  listButtonSelected: {
    backgroundColor: "#dbeafe",
    borderColor: "#93c5fd",
  },
  listButtonText: {
    fontSize: 15,
    color: "#475569",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    backgroundColor: "#fff",
  },
  dropdownText: {
    fontSize: 15,
    color: "#475569",
  },
  dropdownOptions: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 12,
    marginTop: 4,
    marginBottom: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  dropdownOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  dropdownOptionText: {
    fontSize: 15,
    color: "#475569",
  },
  requiredItemContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  weeklyActivityContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  annualScheduleContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#334155",
  },
  buttonContainer: {
    backgroundColor: "#1e3a8a",
    borderRadius: 12,
    padding: 14,
    marginVertical: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonOutline: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1e3a8a",
    padding: 14,
    marginVertical: 8,
    alignItems: "center",
  },
  buttonOutlineText: {
    color: "#1e3a8a",
    fontSize: 16,
    fontWeight: "600",
  },
  imagePreview: {
    width: 150, 
    height: 150, 
    marginVertical: 8,
    borderRadius: 8,
  },
});

export default ClubSearchSubmit;