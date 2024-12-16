/*
ユーザー情報のうちロールと部活動を登録する画面です

ユーザー情報についてのfirestoreのデータ構造

firestore
|--user(コレクション)
|  |--{uid}(ドキュメント)
|  |  |  以下はフィールド
|  |  |--username
|  |  |--grade
|  |  |--school
|  |  |--department
|  |  |--course
|  |  |--major
|  |  |--researchroom
|  |  |--role
|  |  |--club

*/


import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  Alert,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList
} from "react-native";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../004BackendModules/messageMetod/firebase"; // これが正しく設定されていることを確認
import RNPickerSelect from "react-native-picker-select";
import submitPersonalInformation from "../../004BackendModules/loginMethod/submitPersonalInformation";
import { ScrollView } from "react-native-gesture-handler";
import DropDownPicker from "react-native-dropdown-picker";
import Autocomplete from "react-native-autocomplete-input";



//部活動・サークル 将来的にfirestoreに保存する　
const clubData = [
  { label: "未所属", value: "null" },
  { label: "陸上競技部", value: "trackAndField" },
  { label: "水泳部", value: "swimming" },
  { label: "テニス部", value: "tennis" },
]

/*
関数DropdownWithSearchとDynamicInputFieldsは部活動の入力欄です。
DynamicInputFieldsは変数を修正しきれていないです。
部活動のデータがFirestore上にあるので入力欄の数を増減させる機能はそのままにsearchcomponentのnamesearchを使おうかと考えています
*/

const DropdownWithSearch = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState(clubData)

  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
      searchable={true} // 検索機能を有効化
      placeholder="選択してください"
    />
  );
};



export default function InputPersonalInformationScreen2({ navigation, route }) {
  const [uid, setUid] = useState("");
  const email = route.params.email;
  const password = route.params.password;
  const username = route.params.information.username;
  const grade = route.params.information.grade;
  const school = route.params.information.school;
  const department = route.params.information.department;
  const course = route.params.information.course;
  const major = route.params.information.major;
  const researchroom = route.params.information.researchroom;

  // const navigation = useNavigation(); // ホーム画面への遷移に使用

  // 永続化をbrowserLocalPersistenceで設定
  // setPersistence(auth, browserLocalPersistence)
  //   .then(() => {
  //     console.log("Persistence set to local.");
  //   })
  //   .catch((error) => {
  //     console.error("Error setting persistence:", error);
  //   });

  const SignUpWithEmail = async (email: string, password: string) => {

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user.uid;
    } catch (error) {
      console.error("Error signing up with email:", error);
      throw error;
    }
  };


  //ロールデータ
  const roleData = [
    { label: "一般学生", value: "commmonStudent" },
    { label: "部/サークル運営者", value: "clubCircleManager" },
    { label: "団体運営者", value: "organizationManager" },
    { label: "コラム投稿者", value: "columnContributor" },
    { label: "管理関係者", value:"management" },
    { label: "上位管理者", value:"superAdministrator" },
  ];

  
  
  const [role, setRole] = useState("");
  const [rolePassword, SetRolePassword] = useState("");
  const [clubTexts, setClubTexts] = useState([{ id: 1, value: "部活動を選択してください" }]);

  const addClubText = () => {
    if (clubTexts.length < 10) {
      setClubTexts([...clubTexts, { id: clubTexts.length + 1, value: "部活動を選択してください" }]);
    } else {
      Alert.alert("テキストは10個までです");
    }
  };

  const removeClubText = (id) => {
    setClubTexts(clubTexts.filter((text) => text.id !== id));
  };

  const handleClubTextChange = (id, value) => {
    setClubTexts(
      clubTexts.map((text) =>
        text.id === id ? { ...text, value: value } : text
      )
    );
  };

  const navigateToSelectClub = (id) => {
    navigation.navigate("SelectClubScreen", {
      clubId: id,
      onSelect: (selectedValue) => handleClubTextChange(id, selectedValue),
    });
  };

  // ロール選択でパスワードが必要なロールをリスト化
  const rolesRequiringPassword = [
    "clubCircleManager",
    "organizationManager",
    "columnContributor",
    "management",
    "superAdministrator"
  ];

  //　ロールのパスワード(仮)
  const rolePasswordSet= {
    "clubCircleManager": "clubCircleManager",
    "organizationManager": "organizationManager",
    "columnContributor": "columnContributor",
    "management": "management",
    "superAdministrator": "superAdministrator"
  }

  // パスワード欄を表示するかどうか
  const requiresPassword = rolesRequiringPassword.includes(role);

  // ロールのパスワードが正しいかチェック if(checkRolePassword)で使う
  const checkRolePassword = () => {
    const correctPassword = rolePasswordSet[role];
    if (role !== "commmonStudent" && rolePassword != correctPassword) {
      Alert.alert("ロールのパスワードが間違っています");
      return false;
    }
    return true;
  }


  const handleSubmit = async () => {
    if (
      !username ||
      !grade ||
      !school ||
      !department ||
      !course ||
      !major ||
      !researchroom ||
      !role ||
      (requiresPassword && !rolePassword) ){
      Alert.alert("全てのフィールドを入力してください");
      return;
    }

    if (!checkRolePassword) {
      return;
    }

    const information = {
      username,
      grade,
      school,
      department,
      course,
      major,
      researchroom,
      role,
      club: clubTexts.map((text) => text.value),};

    navigation.navigate("ConfirmScreen", { email, password, information });

  };




  return (
    <View style={styles.container}>

      {/*ロール選択*/}
      <Text>4. ロール</Text>
      <RNPickerSelect
        onValueChange={(value) => {
          setRole(value);
          SetRolePassword("");
        }}
        items={roleData}
        placeholder={{ label: "ロールを選択してください", value: null }}
        value={role}
      />

      {requiresPassword && (
        <View style={{padding: 20}}>
          <TextInput
            value={rolePassword}
            onChangeText={SetRolePassword}
            secureTextEntry
            placeholder="パスワード(一般学生以上のみ)"
            autoCapitalize="none"
          />
        </View>
      )}

      {/*部活動選択*/}
      <Text>5. 部活動</Text>

      {clubTexts.map((text) => (
        <View key={text.id} style={styles.inputContainer}>
          <Text
            style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginRight: 10 }}
            onPress={() => navigateToSelectClub(text.id)}
          >
            {text.value}
          </Text>
          <TouchableOpacity onPress={() => removeClubText(text.id)}>
            <Text style={{ color: "red" }}>−</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity onPress={addClubText}>
        <Text style={{ color: "blue" }}>＋</Text>
      </TouchableOpacity>

      <Button title="送信" onPress={() => handleSubmit()} />

      
    </View>



  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#f0f0f0",
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
});
