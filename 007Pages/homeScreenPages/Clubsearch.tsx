import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, Button, TouchableOpacity } from "react-native";
import { Menu, Provider } from "react-native-paper";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../006Configs/firebaseConfig2";


const ClubSearch = ({ navigation }) => {
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);
   const [selectedTypeOfClubs, setSelectedTypeOfClubs] = useState('運動系部活');
  const [placeOfActivity, setPlaceOfActivity] = useState('体育館');
     const [freqOfActivity, setfreqOfActivity] = useState("週一回");
      const [forceofActivity, setForceOfActivity] = useState("");
       const [selectedTags, setSelectedTags] = useState([]); // 追加
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
  const [selectedValue1, setSelectedValue1] = useState(null);
  const [selectedValue2, setSelectedValue2] = useState(null);
  const [selectedValue3, setSelectedValue3] = useState(null);
const [selectedValue4, setSelectedValue4] = useState(null);



  const [searchText, setSearchText] = useState('');
  const [clubs, setClubs] = useState([]);
  const [filteredClubs, setFilteredClubs] = useState([]);

  const openMenu1 = () => setVisible1(true);
  const closeMenu1 = () => setVisible1(false);

  const openMenu2 = () => setVisible2(true);
  const closeMenu2 = () => setVisible2(false);

  // Firestoreからデータを取得する関数
  const fetchClubs = async () => {
    try {
      const clubCollectionRef = collection(db, "clubtest");// コレクション名を指定
      const clubCollection = await getDocs(clubCollectionRef);
      const clubList = clubCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setClubs(clubList);
    } catch (error) {
      console.error("Error fetching clubs: ", error);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  // 検索ボタンを押したときの処理
  const handleSearch = () => {
    const filtered = clubs.filter(club =>
      (searchText && club.name.toLowerCase().includes(searchText.toLowerCase())) ||
      (selectedValue1 && (
        (club.tag1[0] && selectedTypeOfClubs === "運動系部活") ||//選択肢は一例。部活ソートではある程度決まってるから手入力でも大丈夫では?
        (club.tag1[1] && selectedTypeOfClubs === "文化系部活") ||
        (club.tag1[2] && selectedTypeOfClubs === "公認運動系サークル") ||
        (club.tag1[3] && selectedTypeOfClubs === "公認文化系サークル") ||
        (club.tag1[4] && selectedTypeOfClubs === "非公認運動系サークル") ||
        (club.tag1[5] && selectedTypeOfClubs === "非公認文化系サークル") ||
        (club.tag1[6] && selectedTypeOfClubs === "活動団体") 
      )) ||
      (selectedValue2 && (
        (club.tag2[0] && placeOfActivity === "体育館") ||
        (club.tag2[1] && placeOfActivity === "グラウンド")||
        (club.tag2[2] && placeOfActivity === "教室") ||
        (club.tag2[3] && placeOfActivity === "その他") 

      ))||
      (selectedValue3 && (
        (club.tag3[0] && freqOfActivity === "月1回") ||
        (club.tag3[1] && freqOfActivity === "月2回") ||
        (club.tag3[2] && freqOfActivity === "週1回") ||
        (club.tag3[3] && freqOfActivity === "週2回")||
        (club.tag3[4] && freqOfActivity === "週3回") ||
        (club.tag3[5] && freqOfActivity === "週4回") ||
        (club.tag3[6] && freqOfActivity === "週5回") ||
        (club.tag3[7] && freqOfActivity === "週6回") ||
        (club.tag3[8] && freqOfActivity === "週7回") 
      )) ||
      (selectedValue4 && (
        (club.tag4[0] && forceofActivity === "参加必須") ||
        (club.tag4[1] && forceofActivity === "連絡ありで欠席可能") ||
        (club.tag4[2] && forceofActivity === "参加自由") 
       

      ))
    );
    setFilteredClubs(filtered);
  };

  // 検索条件をリセットする関数
  const handleReset = () => {
    setSearchText('');
    setSelectedValue1(null);
    setSelectedValue2(null);
    setFilteredClubs(clubs);
  };//リセット押したら全部出力されるよ

  return (
    <Provider>
      <View style={styles.container}>
        <ScrollView>
          <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 16 }}
            placeholder="部活名"
            value={searchText}
            onChangeText={setSearchText}
          />
          <Menu
            visible={visible1}
            onDismiss={closeMenu1}
            anchor={<Button title="タグ1を選択してください..." onPress={openMenu1} />}
          >
            <Menu.Item onPress={() => { setSelectedTypeOfClubs('運動系部活'); closeMenu1(); }} title="運動系部活" />
            <Menu.Item onPress={() => { setSelectedTypeOfClubs('文化系部活'); closeMenu1(); }} title="文化系部活" />
            <Menu.Item onPress={() => { setSelectedTypeOfClubs('公認運動系サークル'); closeMenu1(); }} title="公認運動系サークル" />
            <Menu.Item onPress={() => { setSelectedTypeOfClubs('公認文化系サークル'); closeMenu1(); }} title="公認文化系サークル" />
            <Menu.Item onPress={() => { setSelectedTypeOfClubs('非公認運動系サークル'); closeMenu1(); }} title="非公認運動系サークル" />
            <Menu.Item onPress={() => { setSelectedTypeOfClubs('非公認文化系サークル'); closeMenu1(); }} title="非公認文化系サークル" />
            <Menu.Item onPress={() => { setSelectedTypeOfClubs('活動団体'); closeMenu1(); }} title="活動団体" />

          </Menu>
          <Menu
            visible={visible2}
            onDismiss={closeMenu2}
            anchor={<Button title="タグ2を選択してください..." onPress={openMenu2} />}
          >
            <Menu.Item onPress={() => { setPlaceOfActivity('体育館'); closeMenu2(); }} title="体育館" />
            <Menu.Item onPress={() => { setPlaceOfActivity('グラウンド'); closeMenu2(); }} title="グランンド" />
            <Menu.Item onPress={() => { setPlaceOfActivity('教室'); closeMenu2(); }} title="教室" />
            <Menu.Item onPress={() => { setPlaceOfActivity('その他'); closeMenu2(); }} title="その他" />

          </Menu>
          <Button title="検索" onPress={handleSearch} />
          <Button title="リセット" onPress={handleReset} />
          <Text style={styles.result}>
            タグ1: {selectedTypeOfClubs || "未選択"}
          </Text>
          <Text style={styles.result}>
            タグ2: {selectedValue2 || "未選択"}
          </Text>
          <View style={styles.resultsContainer}>
            {filteredClubs.map((club) => (
              <TouchableOpacity
                key={club.id}
                style={styles.clubItem}
                onPress={() => navigation.navigate('Clubdetail', { clubId: club.id })}//どきゅめんとidを渡して、その詳細ページにとぶ
              >
                <Text style={styles.clubName}>{club.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  result: {
    marginTop: 16,
  },
  resultsContainer: {
    marginTop: 32, // 検索結果を中央より少し下に配置
    alignItems: 'center',
  },
  clubItem: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    width: '80%', // 幅を広く設定
    alignItems: 'center',
  },
  clubName: {
    fontSize: 18, // テキストを大きめに設定
    fontWeight: 'bold',
  },
});

export default ClubSearch;