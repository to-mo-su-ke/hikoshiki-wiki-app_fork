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
  View,
  TextInput,
  Alert,
  Text,
  TouchableOpacity,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Dropdown } from "react-native-paper-dropdown";
import { signUp1Styles } from "../../002Styles/loginstyle";
import { 
  schoolData, 
  departmentData, 
  courseData, 
  majorData, 
  researchroomData, 
  roleData 
} from "../../005Database/course";

export default function InputPersonalInformationScreen1({ navigation, route }) { 
  const [uid, setUid] = useState("");
  const email = route.params.email;
  const password = route.params.password;

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
    <ScrollView style={signUp1Styles.container}>
      <Text style={signUp1Styles.title}>ユーザー情報登録</Text>
      <View style={signUp1Styles.sectionContainer}>
        <Text style={signUp1Styles.sectionTitle}>1. 基本情報</Text>
        <Text style={signUp1Styles.inputLabel}>ユーザー名</Text>
        <TextInput
          style={signUp1Styles.input}
          placeholder="ユーザー名"
          value={username}
          onChangeText={setUsername}
        />

        <Text style={signUp1Styles.inputLabel}>学年</Text>
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
      </View>

      <View style={signUp1Styles.sectionContainer}>
        <Text style={signUp1Styles.sectionTitle}>2. 所属情報</Text>
        
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
      </View>

      <TouchableOpacity style={signUp1Styles.buttonContainer} onPress={handleSubmit}>
        <Text style={signUp1Styles.buttonText}>次へ</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

