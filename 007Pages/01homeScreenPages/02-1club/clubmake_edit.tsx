import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Button, Alert, StyleSheet, ScrollView, Image } from "react-native";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../006Configs/firebaseConfig";
import * as ImagePicker from "expo-image-picker";
import { uploadPhotoToFirestore } from "../../../004BackendModules/mainMethod/uploadPhoto";

const ClubMakeEdit = ({ route, navigation }) => {
  // URLパラメータからdocIdを取得。存在しない場合は空文字列
  const { docId: paramDocId = "" } = route.params || {};
  const [docId, setDocId] = useState(paramDocId);
  const [tempDocId, setTempDocId] = useState(docId);
  const [clubData, setClubData] = useState(null);

  // フィールド用ステート (clubmake と同じフィールドを用意)
  const [searchText, setSearchText] = useState("");
  const [selectedClubType, setSelectedClubType] = useState("");
  const [selectedActivityPlaces, setSelectedActivityPlaces] = useState([]);
  const [clubDetail, setClubDetail] = useState("");
  const [appealPoint, setAppealPoint] = useState("");
  const [badPoint, setBadPoint] = useState("");
  const [membersNumber, setMembersNumber] = useState("");
  const [entryFee, setEntryFee] = useState("");
  const [annualFee, setAnnualFee] = useState("");
  const [photo1Local, setPhoto1Local] = useState(null);
  const [photo2Local, setPhoto2Local] = useState(null);

  // 新規フィールドの state
  const [searchTags, setSearchTags] = useState([]);
  const [activityIntensity, setActivityIntensity] = useState("");
  const [selectedActivityFrequency, setSelectedActivityFrequency] = useState("");
  const [lineId, setLineId] = useState("");
  const [lineQR, setLineQR] = useState("");
  const [instagramId, setInstagramId] = useState("");
  const [instagramQR, setInstagramQR] = useState("");
  const [twitterId, setTwitterId] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [twitterQR, setTwitterQR] = useState("");
  const [discordUrl, setDiscordUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [requiredItems, setRequiredItems] = useState([]);
  const [weeklyActivities, setWeeklyActivities] = useState([]);
  const [annualSchedule, setAnnualSchedule] = useState([]);

  const clubTypes = [
    "運動系部活",
    "文化系部活",
    "公認運動系サークル",
    "公認文化系サークル",
    "非公認運動系サークル",
    "非公認文化系サークル",
    "活動団体",
  ];
  const activityPlaces = ["体育館", "グラウンド", "教室", "その他"];

  const fetchClub = async (id: string) => {
    if (!id.trim()) {
      Alert.alert("エラー", "docId が空です");
      return;
    }
    try {
      const docRef = doc(db, "clubtest", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setClubData(data);

        // フィールドをステートに反映 (例として一部だけ)
        setSearchText(data.searchText || "");
        setSelectedClubType(data.selectedClubType || "");
        setSelectedActivityPlaces(data.selectedActivityPlaces || []);
        setClubDetail(data.clubDetail || "");
        setAppealPoint(data.appealPoint || "");
        setBadPoint(data.badPoint || "");
        setMembersNumber(data.membersNumber || "");
        setEntryFee(data.entryFee || "");
        setAnnualFee(data.annualFee || "");
        // 写真URLをローカルに反映する実処理は環境次第
        setSearchTags(data.searchTags || []);
        setActivityIntensity(data.activityIntensity || "");
        setSelectedActivityFrequency(data.selectedActivityFrequency || "");
        setLineId(data.lineId || "");
        setLineQR(data.lineQR || "");
        setInstagramId(data.instagramId || "");
        setInstagramQR(data.instagramQR || "");
        setTwitterId(data.twitterId || "");
        setTwitterUrl(data.twitterUrl || "");
        setTwitterQR(data.twitterQR || "");
        setDiscordUrl(data.discordUrl || "");
        setWebsiteUrl(data.websiteUrl || "");
        setRequiredItems(data.requiredItems || []);
        setWeeklyActivities(data.weeklyActivities || []);
        setAnnualSchedule(data.annualSchedule || []);
      } else {
        Alert.alert("エラー", "該当ドキュメントがありません");
        setClubData(null);
      }
    } catch (error) {
      console.error("Error fetching club details:", error);
      Alert.alert("エラー", "取得に失敗しました");
      setClubData(null);
    }
  };

  // 写真選択
  const handleSelectPhoto = async (setPhoto) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      const photoUri = result.assets[0].uri;
      setPhoto(photoUri);
      Alert.alert("写真が選択されました");
    }
  };

  // 更新処理
  const handleUpdate = async () => {
    if (!docId.trim()) {
      Alert.alert("エラー", "ドキュメントIDが未入力です");
      return;
    }
    if (!searchText.trim() || !clubDetail.trim()) {
      Alert.alert("エラー", "必須項目を入力してください");
      return;
    }

    // 更新処理内
    try {
      // 写真をFirestorageにアップロード
      let photoUrl1 = null;
      let photoUrl2 = null;
      if (photo1Local) {
        const blob = await (await fetch(photo1Local)).blob();
        photoUrl1 = await uploadPhotoToFirestore(blob);
      }
      if (photo2Local) {
        const blob2 = await (await fetch(photo2Local)).blob();
        photoUrl2 = await uploadPhotoToFirestore(blob2);
      }

      // updatedDataをanyで定義しておく
      let updatedData: any = {
        searchText,
        selectedClubType,
        selectedActivityPlaces,
        clubDetail,
        appealPoint,
        badPoint,
        membersNumber,
        entryFee,
        annualFee,
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
        requiredItems,
        weeklyActivities,
        annualSchedule,
      };
      if (photoUrl1) updatedData.photo1 = photoUrl1;
      if (photoUrl2) updatedData.photo2 = photoUrl2;

      // QR系のアップロード
      if (lineQR) {
        const blob = await (await fetch(lineQR)).blob();
        updatedData.lineQR = await uploadPhotoToFirestore(blob);
      }
      if (instagramQR) {
        const blob = await (await fetch(instagramQR)).blob();
        updatedData.instagramQR = await uploadPhotoToFirestore(blob);
      }
      if (twitterQR) {
        const blob = await (await fetch(twitterQR)).blob();
        updatedData.twitterQR = await uploadPhotoToFirestore(blob);
      }

      const docRef = doc(db, "clubtest", docId);
      await updateDoc(docRef, updatedData);

      Alert.alert("成功", "クラブ情報が更新されました");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating club details:", error);
      Alert.alert("エラー", "更新に失敗しました");
    }
  };

  const searchByDocId = () => {
    setDocId(tempDocId);
    fetchClub(tempDocId); // 入力された docId を引数に
  };

  // docId が未入力、かつパラメータもなかった場合の入力画面
  if (!docId.trim() && !clubData) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>編集したいドキュメントIDを入力</Text>
        <TextInput
          style={styles.input}
          value={tempDocId}
          onChangeText={setTempDocId}
          placeholder="docIdを入力..."
        />
        <Button title="検索" onPress={searchByDocId} />
      </View>
    );
  }

  // docId があり、clubData がフェッチできたあとに表示するフォーム
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>部活名</Text>
      <TextInput
        style={styles.input}
        value={searchText}
        onChangeText={setSearchText}
        placeholder="部活名"
      />

      <Text style={styles.label}>部活種別</Text>
      <View style={styles.dropdownContainer}>
        {clubTypes.map((type, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedClubType(type)}
            style={[
              styles.dropdownOption,
              selectedClubType === type && styles.selectedOption,
            ]}
          >
            <Text>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>活動場所 (複数選択可)</Text>
      {activityPlaces.map((place, idx) => (
        <TouchableOpacity
          key={idx}
          onPress={() => {
            if (selectedActivityPlaces.includes(place)) {
              setSelectedActivityPlaces(
                selectedActivityPlaces.filter((p) => p !== place)
              );
            } else {
              setSelectedActivityPlaces([...selectedActivityPlaces, place]);
            }
          }}
          style={[
            styles.dropdownOption,
            selectedActivityPlaces.includes(place) && styles.selectedOption,
          ]}
        >
          <Text>{place}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.label}>部活動詳細</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={clubDetail}
        onChangeText={setClubDetail}
        multiline
      />

      <Text style={styles.label}>アピールポイント</Text>
      <TextInput
        style={styles.input}
        value={appealPoint}
        onChangeText={setAppealPoint}
      />

      <Text style={styles.label}>バッドポイント</Text>
      <TextInput
        style={styles.input}
        value={badPoint}
        onChangeText={setBadPoint}
      />

      <Text style={styles.label}>所属人数</Text>
      <TextInput
        style={styles.input}
        value={membersNumber}
        onChangeText={setMembersNumber}
        placeholder="例: 30"
        keyboardType="numeric"
      />

      <Text style={styles.label}>入会費</Text>
      <TextInput
        style={styles.input}
        value={entryFee}
        onChangeText={setEntryFee}
        keyboardType="numeric"
      />

      <Text style={styles.label}>年会費</Text>
      <TextInput
        style={styles.input}
        value={annualFee}
        onChangeText={setAnnualFee}
        keyboardType="numeric"
      />

      <Text style={styles.label}>写真1</Text>
      <Button title="写真1を選択" onPress={() => handleSelectPhoto(setPhoto1Local)} />
      {photo1Local && (
        <Image
          source={{ uri: photo1Local }}
          style={{ width: 100, height: 100, marginVertical: 8 }}
        />
      )}

      <Text style={styles.label}>写真2</Text>
      <Button title="写真2を選択" onPress={() => handleSelectPhoto(setPhoto2Local)} />
      {photo2Local && (
        <Image
          source={{ uri: photo2Local }}
          style={{ width: 100, height: 100, marginVertical: 8 }}
        />
      )}

      <Text style={styles.label}>検索用タグ</Text>
      <TextInput
        style={styles.input}
        value={searchTags.join(", ")}
        onChangeText={(text) => setSearchTags(text.split(",").map(tag => tag.trim()))}
      />
      <Text style={styles.label}>活動強制度</Text>
      <TextInput
        style={styles.input}
        value={activityIntensity}
        onChangeText={setActivityIntensity}
      />
      <Text style={styles.label}>活動頻度</Text>
      <TextInput
        style={styles.input}
        value={selectedActivityFrequency}
        onChangeText={setSelectedActivityFrequency}
      />
      <Text style={styles.label}>LINE ID</Text>
      <TextInput
        style={styles.input}
        value={lineId}
        onChangeText={setLineId}
      />
      <Button title="LINE QRを選択" onPress={() => handleSelectPhoto(setLineQR)} />
      {lineQR ? <Image source={{ uri: lineQR }} style={{ width: 100, height: 100 }} /> : null}

      {/* Instagram */}
      <Text style={styles.label}>Instagram ID</Text>
      <TextInput
        style={styles.input}
        value={instagramId}
        onChangeText={setInstagramId}
        placeholder="instagram_id_here"
      />
      <Button title="Instagram QRを選択" onPress={() => handleSelectPhoto(setInstagramQR)} />
      {instagramQR ? (
        <Image source={{ uri: instagramQR }} style={{ width: 100, height: 100, marginVertical: 8 }} />
      ) : null}

      {/* Twitter */}
      <Text style={styles.label}>Twitter ID</Text>
      <TextInput
        style={styles.input}
        value={twitterId}
        onChangeText={setTwitterId}
        placeholder="twitter_id_here"
      />
      <Text style={styles.label}>Twitter URL</Text>
      <TextInput
        style={styles.input}
        value={twitterUrl}
        onChangeText={setTwitterUrl}
        placeholder="https://twitter.com/xxxx"
      />
      <Button title="Twitter QRを選択" onPress={() => handleSelectPhoto(setTwitterQR)} />
      {twitterQR ? (
        <Image source={{ uri: twitterQR }} style={{ width: 100, height: 100, marginVertical: 8 }} />
      ) : null}

      {/* Discord & Website */}
      <Text style={styles.label}>Discord URL</Text>
      <TextInput
        style={styles.input}
        value={discordUrl}
        onChangeText={setDiscordUrl}
        placeholder="https://discord.gg/xxxx"
      />
      <Text style={styles.label}>Website URL</Text>
      <TextInput
        style={styles.input}
        value={websiteUrl}
        onChangeText={setWebsiteUrl}
        placeholder="https://yourclub.example.com"
      />

      {/* 必要物品 (requiredItems) */}
      <Text style={styles.label}>必要物品</Text>
      {requiredItems.map((item, idx) => (
        <View key={idx} style={{ marginBottom: 8 }}>
          <TextInput
            style={styles.input}
            placeholder="物品名"
            value={item.name}
            onChangeText={(txt) => {
              const newItems = [...requiredItems];
              newItems[idx].name = txt;
              setRequiredItems(newItems);
            }}
          />
          <TextInput
            style={styles.input}
            placeholder="値段"
            keyboardType="numeric"
            value={item.price}
            onChangeText={(txt) => {
              const newItems = [...requiredItems];
              newItems[idx].price = txt;
              setRequiredItems(newItems);
            }}
          />
          <TextInput
            style={styles.input}
            placeholder="補足説明"
            value={item.description}
            onChangeText={(txt) => {
              const newItems = [...requiredItems];
              newItems[idx].description = txt;
              setRequiredItems(newItems);
            }}
          />
          <Button title="削除" onPress={() => {
            const newItems = requiredItems.filter((_, i) => i !== idx);
            setRequiredItems(newItems);
          }} />
        </View>
      ))}
      <Button title="必要物品を追加" onPress={() => {
        setRequiredItems([...requiredItems, { name: "", price: "", description: "" }]);
      }} />

      {/* 週活動 (weeklyActivities) */}
      <Text style={styles.label}>週活動内容</Text>
      {weeklyActivities.map((activity, index) => (
        <View key={index} style={{ marginBottom: 8 }}>
          <Text>{activity.day || `Day ${index+1}`}</Text>
          <TouchableOpacity
            style={styles.dropdownOption}
            onPress={() => {
              const newActivities = [...weeklyActivities];
              newActivities[index].hasActivity = !newActivities[index].hasActivity;
              setWeeklyActivities(newActivities);
            }}
          >
            <Text>{activity.hasActivity ? "有" : "無"}</Text>
          </TouchableOpacity>
          {activity.hasActivity && (
            <>
              <TextInput
                style={styles.input}
                placeholder="内容"
                value={activity.content}
                onChangeText={(txt) => {
                  const newActivities = [...weeklyActivities];
                  newActivities[index].content = txt;
                  setWeeklyActivities(newActivities);
                }}
              />
              <TextInput
                style={styles.input}
                placeholder="活動時間 (hh:mm)"
                value={activity.time}
                onChangeText={(txt) => {
                  const newActivities = [...weeklyActivities];
                  newActivities[index].time = txt;
                  setWeeklyActivities(newActivities);
                }}
              />
            </>
          )}
        </View>
      ))}

      {/* 年間スケジュール (annualSchedule) */}
      <Text style={styles.label}>年間スケジュール</Text>
      {annualSchedule.map((schedule, idx) => (
        <View key={idx} style={{ marginBottom: 8 }}>
          <TextInput
            style={styles.input}
            placeholder="月"
            value={schedule.month}
            onChangeText={(txt) => {
              const newSchedule = [...annualSchedule];
              newSchedule[idx].month = txt;
              setAnnualSchedule(newSchedule);
            }}
          />
          <TextInput
            style={styles.input}
            placeholder="イベント名"
            value={schedule.eventName}
            onChangeText={(txt) => {
              const newSchedule = [...annualSchedule];
              newSchedule[idx].eventName = txt;
              setAnnualSchedule(newSchedule);
            }}
          />
          {/* ...existing code for period, content, cost, frequency... */}
          <Button title="削除" onPress={() => {
            const newSchedule = annualSchedule.filter((_, i) => i !== idx);
            setAnnualSchedule(newSchedule);
          }} />
        </View>
      ))}
      <Button title="追加" onPress={() => {
        setAnnualSchedule([...annualSchedule, { month: "", eventName: "", period: "", content: "", cost: "", frequency: 1 }]);
      }} />

      {/* 更新ボタン */}
      <Button title="更新" onPress={handleUpdate} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 16,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    backgroundColor: "#fff",
  },
  dropdownContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  dropdownOption: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginRight: 8,
    marginTop: 8,
  },
  selectedOption: {
    backgroundColor: "#cce5ff",
  },
});

export default ClubMakeEdit;
