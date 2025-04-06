import React, { useState ,useEffect} from "react";
import {
  View,
  TextInput,
  Button,
  Alert,
  Text,
  TouchableOpacity,
} from "react-native";
import { Dropdown } from "react-native-paper-dropdown";
import { signUp2Styles } from "../../002Styles/loginstyle";
import { roleData, clubData } from "../../005Database/course";
import firestore from "@react-native-firebase/firestore";


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
    "superAdministrator",
  ];

  //　ロールのパスワード(仮)
  const rolePasswordSet = {
    clubCircleManager: "clubCircleManager",
    organizationManager: "organizationManager",
    columnContributor: "columnContributor",
    management: "management",
    superAdministrator: "superAdministrator",
  };

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
  };

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
      (requiresPassword && !rolePassword)
    ) {
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
      club: clubTexts.map((text) => text.value),
    };

    navigation.navigate("ConfirmScreen", { email, password, information });
  };

  return (
    <View style={signUp2Styles.container}>
      {/*ロール選択*/}
      <Text>4. ロール</Text>
      <Dropdown
        label="ロール"
        placeholder="ロールを選択してください"
        onSelect={(value) => {
          setRole(value);
          SetRolePassword("");
        }}
        options={roleData}
        value={role}
      />

      {requiresPassword && (
        <View style={{ padding: 20 }}>
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
        <View key={text.id} style={signUp2Styles.inputContainer}>
          <Text
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 5,
              padding: 10,
              marginRight: 10,
            }}
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
}
