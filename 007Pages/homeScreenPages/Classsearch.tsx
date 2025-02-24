import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, Button, TouchableOpacity } from "react-native";
import { Menu, Provider } from "react-native-paper";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../006Configs/firebaseConfig2";

const Classsearch = ({ navigation }) => {
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [selectseason,setselectseason]=useState('春学期');
  const [selectkindofclass,setselectkindofclass]=useState('自然系基礎科目');

      
  const [selectedValue1, setSelectedValue1] = useState(null);
  const [selectedValue2, setSelectedValue2] = useState(null);




  const [searchText, setSearchText] = useState('');
  const [searchpf,setsearchpf]=useState('');
  const [classes, setclasses] = useState([]);
  const [filteredclass, setFilteredclass] = useState([]);

  const openMenu1 = () => setVisible1(true);
  const closeMenu1 = () => setVisible1(false);

  const openMenu2 = () => setVisible2(true);
  const closeMenu2 = () => setVisible2(false);

  // Firestoreからデータを取得する関数
  const fetchClass = async () => {
    try {
      const classCollectionRef = collection(db, "classtest");// コレクション名を指定
      const classCollection = await getDocs(classCollectionRef);
      const classList = classCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setclasses(classList);
    } catch (error) {
      console.error("Error fetching class: ", error);
    }
  };

  useEffect(() => {
    fetchClass();
  }, []);

  // 検索ボタンを押したときの処理
  const handleSearch = () => {
    const filtered = classes.filter(classroom =>
      (searchText && classroom.name.toLowerCase().includes(searchText.toLowerCase())) ||
      (searchpf && classroom.pf.toLowerCase().includes(searchpf.toLowerCase()))
      (selectedValue1 && (
        (classroom.tag1[0] && selectseason === "春学期") ||//選択肢は一例。部活ソートではある程度決まってるから手入力でも大丈夫では?
        (classroom.tag1[1] && selectseason === "秋学期") 
        
      )) ||
      (selectedValue2 && (
        (classroom.tag2[0] && selectkindofclass === "自然基礎科目") ||
        (classroom.tag2[1] && selectkindofclass === "言語科目")||
        (classroom.tag2[2] && selectkindofclass === "専門基礎科目") ||
        (classroom.tag2[3] && selectkindofclass === "") 

      ))
    );
      
    
    setFilteredclass(filtered)
  };

  // 検索条件をリセットする関数
  const handleReset = () => {
    setSearchText('');
    setSelectedValue1(null);
    setSelectedValue2(null);
    setFilteredclass(classes);
  };//リセット押したら全部出力されるよ

  return (
    <Provider>//ここらへんでMaterial-UIのようなものを使っている
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
            <Menu.Item onPress={() => { setselectseason('春学期'); closeMenu1(); }} title="運動系部活" />
            <Menu.Item onPress={() => { setselectseason('秋学期'); closeMenu1(); }} title="文化系部活" />
          
          </Menu>
          <Menu
            visible={visible2}
            onDismiss={closeMenu2}
            anchor={<Button title="タグ2を選択してください..." onPress={openMenu2} />}
          >
            <Menu.Item onPress={() => { setselectkindofclass('自然基礎科目'); closeMenu2(); }} title="自然基礎科目" />
            <Menu.Item onPress={() => { setselectkindofclass('言語科目'); closeMenu2(); }} title="言語科目" />
            <Menu.Item onPress={() => { setselectkindofclass('専門基礎科目'); closeMenu2(); }} title="専門基礎科目" />
            <Menu.Item onPress={() => { setselectkindofclass('専門科目'); closeMenu2(); }} title="専門科目" />

          </Menu>
          <Button title="検索" onPress={handleSearch} />
          <Button title="リセット" onPress={handleReset} />
          <Text style={styles.result}>
            タグ1: {selectseason || "未選択"}
          </Text>
          <Text style={styles.result}>
            タグ2: {selectkindofclass || "未選択"}
          </Text>
          <View style={styles.resultsContainer}>
            {filteredclass.map((classes) => (
              <TouchableOpacity
                key={classes.id}
                style={styles.classItem}
                onPress={() => navigation.navigate('classdetail', { classId: classes.id })}//どきゅめんとidを渡して、その詳細ページにとぶ
              >
                <Text style={styles.className}>{classes.name}</Text>
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
  classItem: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    width: '80%', // 幅を広く設定
    alignItems: 'center',
  },
  className: {
    fontSize: 18, // テキストを大きめに設定
    fontWeight: 'bold',
  },
});

export default Classsearch;