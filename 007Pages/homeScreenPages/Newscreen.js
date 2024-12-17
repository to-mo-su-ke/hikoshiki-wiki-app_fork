import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions ,TextInput,TouchableOpacity,FlatList,Alart} from "react-native";
import * as ImagePicker from "expo-image-picker";
import RNPickerSelect from "react-native-picker-select";
import DateTimePicker from "@react-native-community/datetimepicker";
import { submitDataToFirestore} from "../../004BackendModules/mainMethod/submitdata";
import { uploadPhotoToFirestore } from "../../004BackendModules/mainMethod/uplopadPhoto";
import { Menu, Button, Provider } from "react-native-paper";
import UseScrollBar from "../../hooks/usescrollbar";
import { Image } from "react-native";
import { firebaseConfig } from "../../firebaseConfig";

const NewScreen = () => {
  const {
    handleScroll,
    handleContentSizeChange,
    handleLayout,
    scrollBarHeight,
    scrollBarPosition,
  } = UseScrollBar();


  //textInputは、テキスト入力の値を保持するための状態
  const [clabsName, setClabsname] = useState("");
  const[leaderName, setLeaderName] = useState("");
  const [selectedTypeOfClubs, setSelectedTypeOfClubs] = useState('運動系部活');
  const [placeOfActivity, setPlaceOfActivity] = useState('体育館');
  const [freqOfActivity, setfreqOfActivity] = useState("週一回");
  const [detailOfClubs, setdetailOfClubs] = useState("");
  const [goodPointOfClubs, setGoodPointOfClubs] = useState("");
  const [badPointOfClubs, setBadPointOfClubs] = useState("");
  const [costOfActivity, setCostOfActivity] = useState("0");
  const [costOfStart, setCostOfStart] = useState("0");
  //必要な物品とその価格の二要素を持つ配列
  const [costOfItems, setCostOfItems] = useState([{ item: "", cost: "" }]);
  //各曜日の活動頻度を持つ配列
  const [dayOfActivity, setdayOfActivity] = useState([
    { day: "月", freq: "" },
    { day: "火", freq: "" },
    { day: "水", freq: "" },
    { day: "木", freq: "" },
    { day: "金", freq: "" },
    { day: "土", freq: "" },
    { day: "日", freq: "" },
  ]);
  const [flagDayOfActivitiyError, setFlagDayOfActivityError] = useState([]);
  //一年間の活動について、月/名前/内容を持つ配列(各月0個以上の要素を持つ)
  const [monthOfActivity, setMonthOfActivity] = useState([
    { month: "1月", name: "", content: "" },
    { month: "2月", name: "", content: "" },
    { month: "3月", name: "", content: "" },
    { month: "4月", name: "", content: "" },
    { month: "5月", name: "", content: "" },
    { month: "6月", name: "", content: "" },
    { month: "7月", name: "", content: "" },
    { month: "8月", name: "", content: "" },
    { month: "9月", name: "", content: "" },
    { month: "10月", name: "", content: "" },
    { month: "11月", name: "", content: "" },
    { month: "12月", name: "", content: "" },
  ]);
  const [flagMonthOfActivityError, setFlagMonthOfActivityError] = useState([false]);
  //部活動/サークルの写真を保持するための状態
  const [clubImage, setClubImage] = useState(null);
  //部活動/サークルの写真を保持するための状態2
  const [clubImage2, setClubImage2] = useState(null);
  //Instagramのユーザー名とURLとQRコード(写真)を格納する
  const [instagram, setInstagram] = useState("");
  const [instagramURL, setInstagramURL] = useState("");
  const [instagramQR, setInstagramQR] = useState(null);
  //Twitterのユーザー名とURLを格納する
  const [twitter, setTwitter] = useState("");
  const [twitterURL, setTwitterURL] = useState("");
  //公式ラインのQRコード(写真)を格納する
  const [lineQR, setLineQR] = useState(null);
  //部活動/サークルの公式HPのURLを格納する
  const [officialHP, setOfficialHP] = useState("");
  //discordグループのURLを格納する
  const [discord, setDiscord] = useState("");
  //30個のタグがTrueかFalseかを格納する(タグ名はあとから設定する)
  const [clabTags, setclabTags] = useState([]);
  //サークル所属人数
  const [numberOfMembers, setNumberOfMembers] = useState("");
  const [selectedTags, setSelectedTags] = useState([]); // 追加
  const [selectedImage, setSelectedImage] = useState(null); // 追加
  //タグの選択肢
  const tagsSel = [
    "初心者歓迎",
    "経験者求む",

    "ゆるく楽しむ",
    "勉強と両立する",
    "本気で取り組む",

    "インカレ",
    "学内限定",

    "合宿",
    "大会出場",
    "大学祭出演",

    "就職に役立つ",
    "新しいことに挑戦",
    "珍しい内容",

    "人との交流多め",
    "人との交流少なめ",

    "縦のつながり強め",

    "法学部限定",
    "医学部限定",
    "農学部限定",
    "教育学部限定",

    "部室あり",

    "飲み多め",
    "飲み少なめ",

    "兼部/サー可"
  ];
  const handleListButtonPress = (label) => {
    setSelectedTags((prevSelectedTags) => {
      if (prevSelectedTags.includes(label)) {
        return prevSelectedTags.filter((tag) => tag !== label);
      } else {
        return [...prevSelectedTags, label];
      }
    });
  };
 


  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [visible3, setVisible3] = useState(false);
  const [visible4, setVisible4] = useState(false);
  const [visible5, setVisible5] = useState(false);
  const [visible6, setVisible6] = useState(false);
  const [visible7, setVisible7] = useState(false);
  const [visible8, setVisible8] = useState(false);
  const [visible9, setVisible9] = useState(false);
  const [visible10, setVisible10] = useState(false);
  const [visible11, setVisible11] = useState(false);
  const [visible12, setVisible12] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false); // 追加
  


  const openMenu1 = () => setVisible1(true);
  const closeMenu1 = () => setVisible1(false);

  const openMenu2 = () => setVisible2(true);
  const closeMenu2 = () => setVisible2(false);

  const openMenu3 = () => setVisible3(true);
  const closeMenu3 = () => setVisible3(false);

  const openMenu4 = () => setVisible4(true);
  const closeMenu4 = () => setVisible4(false);
  
  const openMenu5 = () => setVisible5(true);
  const closeMenu5 = () => setVisible5(false);

  const openMenu6 = () => setVisible6(true);
  const closeMenu6 = () => setVisible6(false);

  const openMenu7 = () => setVisible7(true);
  const closeMenu7 = () => setVisible7(false);

  const openMenu8 = () => setVisible8(true);
  const closeMenu8 = () => setVisible8(false);

  const openMenu9 = () => setVisible9(true);
  const closeMenu9 = () => setVisible9(false);

  const openMenu10 = () => setVisible10(true);
  const closeMenu10 = () => setVisible10(false);
  
  

  const handleSubmit = async () => {
    let imageUrl = null;
    if (selectedImage) {
      imageUrl = await uploadPhotoToFirestore(selectedImage);
    }
    const data = {
      clabsName,
      selectedTypeOfClubs,
      placeOfActivity,
      freqOfActivity,
      detailOfClubs,
      goodPointOfClubs,
      badPointOfClubs, // 追加
      instagramURL,
      instagramQR,
      twitter,
      twitterURL,
      lineQR,
      officialHP,
      discord,
      clabTags,
      numberOfMembers,
      imageUrl, // 追加
      activitySchedule, // 追加
    }
    try {
      await submitDataToFirestore(data);
      setSubmitSuccess(true); // 送信成功時に状態を更新
      Alert.alert("送信成功", "データが正常に送信されました");
    } catch (error) {
      console.error("Error submitting data:", error);
      Alert.alert("送信失敗", "データの送信中にエラーが発生しました");
    }
  };
    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

  
      if (!result.canceled) {
        setSelectedImage(result.uri);
      }
    };
   
  //画面のレンダリング
  return (
    <Provider>
    <View style={styles.container}>
      <View style={styles.scrollContainer} onLayout={handleLayout}>
        <ScrollView
          style={styles.scrollView}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onContentSizeChange={handleContentSizeChange}
        >
            <Text>部活動/サークル名称:</Text>
      <TextInput
        style={styles.textInput}
        placeholder="正式名称を入力してください"
        value={clabsName}
        onChangeText={setClabsname}
      />
      <Text>部活動/サークルの代表者名:</Text>
      <TextInput

        style={styles.textInput}
        placeholder="代表者名を入力してください"
        value={leaderName}
        onChangeText={setLeaderName}
      />
      
      <View style={{ flexDirection: "row" }}>
        //文字は中央寄せ
        <View style={{ flexDirection: "column", flex: 1 ,alignItems: "center"}}>
  <Text>部活動/サークルの種類</Text>
  <Menu
    visible={visible1}
    onDismiss={closeMenu1}
    anchor={<Button onPress={openMenu1}><Text>{selectedTypeOfClubs}</Text></Button>}
  >
    <Menu.Item onPress={() => {setSelectedTypeOfClubs ('運動系部活'); closeMenu1(); }} title="運動系部活" />
    <Menu.Item onPress={() => {setSelectedTypeOfClubs ('文化系部活'); closeMenu1(); }} title="文化系部活" />
    <Menu.Item onPress={() => {setSelectedTypeOfClubs ('公認運動系サークル'); closeMenu1(); }} title="公認運動系サークル" />
    <Menu.Item onPress={() => {setSelectedTypeOfClubs ('公認文化系サークル'); closeMenu1(); }} title="公認文化系サークル" />
    <Menu.Item onPress={() => {setSelectedTypeOfClubs ('非公認運動系サークル'); closeMenu1(); }} title="非公認運動系サークル" />
    <Menu.Item onPress={() => {setSelectedTypeOfClubs ('非公認文化系サークル'); closeMenu1(); }} title="非公認文化系サークル" />
    <Menu.Item onPress={() => {setSelectedTypeOfClubs ('活動団体'); closeMenu1(); }} title="その他" />
  </Menu>
</View>
<View style={{ flexDirection: "column", flex: 1 ,alignItems: "center"}}>
  <Text>部活動/サークルの活動場所</Text>
  <Menu
    visible={visible2}
    onDismiss={closeMenu2}
    anchor={<Button onPress={openMenu2}><Text>{placeOfActivity}</Text></Button>}
  >
    <Menu.Item onPress={() => {setPlaceOfActivity ('体育館'); closeMenu2(); }} title="体育館" />
    <Menu.Item onPress={() => {setPlaceOfActivity ('グラウンド'); closeMenu2(); }} title="グラウンド" />
    <Menu.Item onPress={() => {setPlaceOfActivity ('教室'); closeMenu2(); }} title="教室" />
    <Menu.Item onPress={() => {setPlaceOfActivity ('その他'); closeMenu2(); }} title="その他" />
  </Menu>
</View>
     
      <View style={{ flexDirection: "column", flex: 1 ,alignItems: "center"}}>
      <Text>部活動/サークルの活動頻度</Text>
      <Menu
          visible={visible3}
          onDismiss={closeMenu3}
          anchor={<Button onPress={openMenu3}><Text>{freqOfActivity}</Text></Button>}
        >
          <Menu.Item onPress={() => {setfreqOfActivity ('月1回'); closeMenu3(); }} title="月1回" />
          <Menu.Item onPress={() => {setfreqOfActivity ('月2回'); closeMenu3(); }} title="週1回" />
          <Menu.Item onPress={() => {setfreqOfActivity ('週1回'); closeMenu3(); }} title="週1回" />
          <Menu.Item onPress={() => {setfreqOfActivity ('週2回'); closeMenu3(); }} title="週2回" />
          <Menu.Item onPress={() => {setfreqOfActivity ('週3回'); closeMenu3(); }} title="週3回" />
          <Menu.Item onPress={() => {setfreqOfActivity ('週4回'); closeMenu3(); }} title="週4回" />
          <Menu.Item onPress={() => {setfreqOfActivity ('週5回'); closeMenu3(); }} title="週5回" />
          <Menu.Item onPress={() => {setfreqOfActivity ('週6回'); closeMenu3(); }} title="週6回" />
          <Menu.Item onPress={() => {setfreqOfActivity ('週7回'); closeMenu3(); }} title="週7回" />
        </Menu>
      </View>
      </View>

      <Text>部活動/サークルの説明:</Text>
      <TextInput
        style={styles.longTextInput2}
        placeholder="部活動/サークルの説明を入力してください"
        value={detailOfClubs}
        onChangeText={setdetailOfClubs}
        multiline
        numberOfLines={4}
      />
      <Text>{detailOfClubs.length}/1000</Text>
      <View style={{ flexDirection: "row" }}>
      <View style={{ flexDirection: "column", flex: 1 ,alignItems: "center"}}>
      <Text>部活動/サークルの良い点:</Text>
      <TextInput
        style={styles.longTextInput}
        placeholder="部活動/サークルの良い点を入力してください"
        value={goodPointOfClubs}
        onChangeText={setGoodPointOfClubs}
        multiline
        numberOfLines={4}
      />
      <Text>{goodPointOfClubs.length}/1000</Text>
      </View>
      <View style={{ flexDirection: "column", flex: 1 ,alignItems: "center"}}>

      <Text>部活動/サークルの悪い点:</Text>
      <TextInput
        style={styles.longTextInput}
        placeholder="部活動/サークルの悪い点を入力してください"
        value={badPointOfClubs}
        onChangeText={setBadPointOfClubs}
        multiline
        numberOfLines={4}
      />
      <Text>{badPointOfClubs.length}/1000</Text>
      </View>
      </View>
      <Text style={{ fontSize: 20 }}>部活動/サークルの写真</Text>
      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        <Text style={styles.imagePickerText}>写真を選択</Text>
      </TouchableOpacity>
      {selectedImage && (
        <Image source={{ uri: selectedImage }} style={{ width: 200, height: 200 }} />
      )
      }
      <Text>部活動/サークルの所属人数</Text>
      <TextInput
        style={styles.textInput2}
        placeholder="所属人数を入力してください"
        value={numberOfMembers}
        onChangeText={setNumberOfMembers}
      />
      <Text>月ごとの活動内容</Text>
      {monthOfActivity.map((month, index) => (
        <View key={index} style={{ flexDirection: "row", alignItems: "center" }}>
          <TextInput

            style={[styles.textInput, { flex: 1 }]}
            placeholder="月"
            value={month.month}

            onChangeText={(text) => {
              const newMonthOfActivity = [...monthOfActivity];
              newMonthOfActivity[index].month = text;
              setMonthOfActivity(newMonthOfActivity);
            }}

          />
          <TextInput

            style={[styles.textInput, { flex: 1 }]}
            placeholder="名前"
            value={month.name}
            onChangeText={(text) => {
              const newMonthOfActivity = [...monthOfActivity];
              newMonthOfActivity[index].name = text;
              setMonthOfActivity(newMonthOfActivity);
            }}

          />
          <TextInput

            style={[styles.textInput, { flex: 1 }]}
            placeholder="内容"
            value={month.content}
            onChangeText={(text) => {
              const newMonthOfActivity = [...monthOfActivity];
              newMonthOfActivity[index].content = text;
              setMonthOfActivity(newMonthOfActivity);
            }}

          />
          <TouchableOpacity

            onPress={() => {
              const newMonthOfActivity = monthOfActivity.filter((_, i) => i !== index);
              setMonthOfActivity(newMonthOfActivity);
            }}

          >
            <Text>削除</Text>
          </TouchableOpacity>
        </View>
      ))}
      
      <Text>部活動/サークルの活動日程</Text>
      {dayOfActivity.map((day, index) => (
        <View key={index} style={{ flexDirection: "row", alignItems: "left" }}>
          <Text>{day.day}  
          </Text>
          <TextInput

            style={[styles.textInput, { flex:1 }]}
            placeholder="活動頻度を入力してください"
            value={day.freq}
            onChangeText={(text) => {
              const newDayOfActivity = [...dayOfActivity];
              newDayOfActivity[index].freq = text;
              setdayOfActivity(newDayOfActivity);
            }}
          />
        </View>
      ))}
      
      <View style={{ flexDirection: "row" }}>
        <View style={{ flexDirection: "column", flex: 1 ,alignItems: "center"}}>
      <Text>入部費用</Text>
      <View style={{ flexDirection: "row"}}>
      <TextInput
        style={styles.textInput2}
        placeholder="入部費用を入力してください"
        value={costOfStart}
        onChangeText={setCostOfStart}
      />
      <Text>円</Text>
      </View>
      </View>

      <View style={{ flexDirection: "column", flex: 1 ,alignItems: "center"}}>
      <Text>一年間でかかる費用の合計</Text>
      <View style={{ flexDirection: "row"}}>
      <TextInput
        style={styles.textInput2}
        placeholder="一年間でかかるその他費用の合計を入力してください"
        value={costOfActivity}
        onChangeText={setCostOfActivity}
      />
      <Text>円</Text>
      </View>
      </View>

      </View>




      //必要な物品とその価格の二要素を持つ配列に入力
      //FlatListはスクロールビュー内で使用できない。なのでプラスボタンを押すごとに入力欄が増えるようにする。
      <Text>必要な物品とその価格</Text>
      {costOfItems.map((item, index) => (
        <View key={index} style={{ flexDirection: "row", alignItems: "center" }}>
          <TextInput
            style={[styles.textInput, { flex: 1 }]}
            placeholder="物品名"
            value={item.item}
            onChangeText={(text) => {
              const newCostOfItems = [...costOfItems];
              newCostOfItems[index].item = text;
              setCostOfItems(newCostOfItems);
            }}
          />
          <TextInput
            style={[styles.textInput, { flex: 1 }]}
            placeholder="価格"
            value={item.cost}
            onChangeText={(text) => {
              const newCostOfItems = [...costOfItems];
              newCostOfItems[index].cost = text;
              setCostOfItems(newCostOfItems);
            }}
          />
          <TouchableOpacity
            onPress={() => {
              const newCostOfItems = costOfItems.filter((_, i) => i !== index);
              setCostOfItems(newCostOfItems);
            }}
          >
            <Text>削除</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity
        onPress={() => setCostOfItems([...costOfItems, { item: "", cost: "" }])}
      >
        <Text>+</Text>
      </TouchableOpacity>
      <Text>リストボタンを表示</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
        {tagsSel.map((label, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleListButtonPress(label)}
            style={{
              fontSize: 10,
              flexDirection: "row",
              alignItems: "center",
              padding: 10,
              backgroundColor: selectedTags.includes(label) ? "lightblue" : "white",
              borderWidth: 1,
              borderColor: "gray",
              width: "49%",
            }}
          >
            <Text style={{ marginRight: 10 }}>
              {selectedTags.includes(label) ? "●" : "○"}
            </Text>
            <Text>{label}</Text>
          </TouchableOpacity>
              ))}
            </View>

      
     <Text>連絡先</Text>
     <TextInput
            style={styles.textInput}
            placeholder="公式HPのリンク"
            value={officialHP}
            onChangeText={setOfficialHP}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Discordのリンク"
            value={discord}
            onChangeText={setDiscord}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Twitterのリンク"
            value={twitterURL}
            onChangeText={setTwitterURL}
          />
          <TextInput
            style={styles.textInput}
            placeholder="LINEのリンク"
            value={lineQR}
            onChangeText={setLineQR}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Instagramのリンク"
            value={instagramURL}
            onChangeText={setInstagramURL}
          />
          <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
            <Text style={styles.imagePickerText}>写真を選択</Text>
          </TouchableOpacity>
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={{ width: 200, height: 200 }} />
          )}

<Button onPress={handleSubmit}>送信</Button>
 {submitSuccess && <Text style={styles.successMessage}>送信成功</Text>} {/* 送信成功メッセージ */}
          
        </ScrollView>
        //スクロールバーのスタイル
        <View style={styles.scrollBarContainer}>
          <View
            style={[
              styles.scrollBar,
              { height: scrollBarHeight, top: scrollBarPosition },
            ]}
          />
        </View>
      </View>
    </View>
    </Provider>
  );
};


const styles = StyleSheet.create({
    //タイトルを別枠で表示したい際のスタイル
  titleContainer: {
    width: "100%",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 0,
    borderBottomWidth: 1,
    backgroundColor: "#f0f0f0",
    marginTop: 0,
  },
  
  imagePicker: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  imagePickerText: {
    fontSize: 18,
  },

  //タイトルのスタイル
  title: {
    fontSize: 24,
    marginRight: 10,
  },
  //基本コンテナスタイル
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    flexDirection: "row",
  },
  scrollView: {
    flex: 1,
    padding: 10,
  },

  //スクロールバーのスタイル
  scrollBarContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: "0.8%",
    backgroundColor: "#c0c0c0",
  },
  scrollBar: {
    position: "absolute",
    right: 0,
    width: "100%",
    backgroundColor: "#808080",
    borderRadius: 2.5,
  },
  textInput: {
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
  },
  textInput2: {
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    width: "80%",
    textAlign: "center",
  },
  longTextInput: {
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    width: "98%",
    height: 100,
  },
  longTextInput2: {
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    width: "100%",
    height: 100,
  },

  
});



export default NewScreen;