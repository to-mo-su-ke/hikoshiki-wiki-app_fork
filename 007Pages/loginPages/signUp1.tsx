/*
ユーザー情報のうち学年、学部～研究室を登録する画面です

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
import { auth } from "../004BackendModules/messageMetod/firebase"; // これが正しく設定されていることを確認
import { ScrollView } from "react-native-gesture-handler";
import { Dropdown } from "react-native-paper-dropdown"

//部活動・サークル
const clubData = [
  { label: "未所属", value: "null" },
  { label: "陸上競技部", value: "trackAndField" },
  { label: "水泳部", value: "swimming" },
  { label: "テニス部", value: "tennis" }
]




export default function InputPersonalInformationScreen1({ navigation, route }) { 
  const [uid, setUid] = useState("");
  const email = route.params.email;
  const password = route.params.password;

  // 永続化をbrowserLocalPersistenceで設定
  // setPersistence(auth, browserLocalPersistence)
  //   .then(() => {
  //     console.log("Persistence set to local.");
  //   })
  //   .catch((error) => {
  //     console.error("Error setting persistence:", error);
  //   });


  //学部~研究室を選択するためのデータ。未配属の場合はそれぞれのプロパティの値は"unaffiliated"です
  // 学部データ
  const schoolData = [
    { label: '理学部', value: 'science' },
    { label: '工学部', value: 'engineering' },
  ];

  // 学科データ
  const departmentData = {
    science: [
      { label: "学科配属前", value: "unaffiliated"},
      { label: '数学科', value: 'math' },
      { label: '物理学科', value: 'physics' },
    ],
    engineering: [
      { label: '電気工学科', value: 'electrical' },
      { label: '機械工学科', value: 'mechanical' },
    ],
  };

  // コースデータ
  const courseData = {
    unaffiliated: [
      { label: "コース配属前", value: "unaffiliated"}
    ],
    math: [
      { label: '応用数学コース', value: 'appliedMath' },
      { label: '理論数学コース', value: 'theoreticalMath' },
    ],
    physics: [
      { label: '量子物理学コース', value: 'quantumPhysics' },
      { label: '宇宙物理学コース', value: 'astrophysics' },
    ],
    electrical: [
      { label: '電力工学コース', value: 'powerEngineering' },
      { label: '電子工学コース', value: 'electronics' },
    ],
    mechanical: [
      { label: '材料工学コース', value: 'materialsEngineering' },
      { label: 'ロボティクスコース', value: 'robotics' },
    ],
  };

  //専攻データ
  const majorData = {
    unaffiliated: [
      { label: "専攻選択前", value: "unaffiliated"}
    ],
    appliedMath: [
      { label: "a", value: "a" },
    ],
    theoreticalMath: [
      { label: "b", value: "b" },
    ],
    quantumPhysics: [
      { label: "c", value: "c" },
    ],
    astrophysics: [
      { label: "d", value: "d" },
    ],
    powerEngineering: [
      { label: "e", value: "e" },
    ],
    electronics: [
      { label: "f", value: "f" },
    ],
    materialsEngineering: [
      { label: "g", value: "g" },
    ],
    robotics: [
      { label: "h", value: "h" },
    ],
  };

  //研究室データ
  const researchroomData = {
    unaffiliated: [
      { label: "研究室配属前", value: "unaffiliated"}
    ],
    a: [
      { label: "aa", value: "aa" },
      { label: "ab", value: "ab" },
    ],
    b: [
      { label: "ba", value: "ba" },
      { label: "bb", value: "bb" },
    ],
    c: [
      { label: "ca", value: "ca" },
      { label: "cb", value: "cb" },
    ],
    d: [
      { label: "da", value: "da" },
      { label: "db", value: "db" },
    ],
    e: [
      { label: "ea", value: "ea" },
      { label: "eb", value: "eb" },
    ],
    f: [
      { label: "fa", value: "fa" },
      { label: "fb", value: "fb" },
    ],
    g: [
      { label: "ga", value: "ga" },
      { label: "gb", value: "gb" },
    ],
    h: [
      { label: "ha", value: "ha" },
      { label: "hb", value: "hb" },
    ],
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

  
  
  const [username, setUsername] = useState("");
  const [grade, setGrade] = useState(null);
  const [school, setSchool] = useState(null);
  const [department, setDepartment] = useState(null);
  const [course, setCourse] = useState(null);
  const [major, setMajor] = useState(null);
  const [researchroom, setResearchroom] = useState(null);
  const [role, setRole] = useState("");


  const handleSubmit = () => {
    if (
      !username ||
      !grade ||
      !school ||
      !department ||
      !course ||
      !major ||
      !researchroom    
    ) {
      Alert.alert("全てのフィールドを入力してください");
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
        };

    navigation.navigate("InputPersonalInformationScreen2", { email, password, information });
  };


  

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text>1.ユーザー名</Text>
        <TextInput
          style={{ borderColor: "gray", borderWidth: 1, marginBottom: 20 }}
          placeholder="ユーザー名"
          value={username}
          onChangeText={setUsername}
        />

        <Text>2.学年</Text>
        <Dropdown
          label="学年"
          placeholder={"選択してください"}
          options={[
            { label: "学部1年", value: "1" },
            { label: "学部2年", value: "2" },
            { label: "学部3年", value: "3" },
            { label: "学部4年", value: "4" },
            { label: "修士1年", value: "5" },
            { label: "修士2年", value: "6" },
            { label: "博士1年", value: "7" },
            { label: "博士2年", value: "8" },
          ]}
          onSelect={setGrade}
          value={grade}
        />

        {/* 学部選択 */}
        <Text>3.1 学部</Text>
        <Dropdown
          label="学部"
          placeholder={'学部を選択してください'}
          onSelect={(value) => {
            setSchool(value);
            setDepartment(null); // 学部変更時に学科をリセット
            setCourse(null); // 学部変更時にコースをリセット
            setMajor(null); // 学部変更時に専攻をリセット
            setResearchroom(null); // 学部変更時に研究室をリセット
          }}
          options={schoolData}
          value={school}
        />

        {/* 学科選択 */}
        <Text>3.2 学科</Text>
        <Dropdown
          label="学科"
          placeholder={'学科を選択してください'}
          onSelect={(value) => {
            setDepartment(value);
            setCourse(null); // 学科変更時にコースをリセット
            setMajor(null); // 学科変更時に専攻をリセット
            setResearchroom(null); // 学科変更時に研究室をリセット
          }}
          options={school ? departmentData[school] : []}
          value={department}
        />

        {/* コース選択 */}
        <Text>3.3 コース</Text>
        <Dropdown
          label="コース"
          placeholder={'コースを選択してください'}
          onSelect={(value) => {
            setCourse(value)
            setMajor(null); // コース変更時に専攻をリセット
            setResearchroom(null); // コース変更時に研究室をリセット
          }}
          options={department ? courseData[department] : []}
          value={course}
        />

        {/* 専攻選択 */}
        <Text>3.3 専攻</Text>
        <Dropdown
          label="専攻"
          placeholder={'専攻を選択してください'}
          onSelect={(value) => {
            setMajor(value)
            setResearchroom(null); // 専攻変更時に研究室をリセット
          }}
          options={course ? majorData[course] : []}
          value={major}
        />

        {/* 院(研究室)選択 */}
        <Text>3.4 院</Text>
        <Dropdown
          label="研究室"
          placeholder={'研究室を選択してください'}
          onSelect={(value) => setResearchroom(value)}
          options={major ? researchroomData[major] : []}
          value={researchroom}
        />

        <Button title="送信" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
});

