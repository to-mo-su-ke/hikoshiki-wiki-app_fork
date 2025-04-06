import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  Alert,
  Text,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { List } from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";
import { db } from "../../../../006Configs/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function Gradehome({ navigation, route }) {
  // 成績用state
  const [GPA, setGPA] = useState("");
  const [grade, setGrade] = useState(null); // 学部/学科内順位用
  const [desiredDeptRank, setDesiredDeptRank] = useState(""); // 志望社内順位
  const [graduationUnits, setGraduationUnits] = useState(""); // 卒業単位
  const [showCurrentGrade, setShowCurrentGrade] = useState(false); // Accordionの展開用

  // Firestoreからユーザー情報取得
  const { userId } = route.params;
  const [user, setuser] = useState(null);

  useEffect(() => {
    const fetchuser = async () => {
      try {
        const userDocRef = doc(db, "user", userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setuser(data);
          // firebaseのuserドキュメントから各値を取得
          setGPA(data.GPA ?? "");
          setGrade(data.grade ?? null);
          setDesiredDeptRank(data.desiredDeptRank ?? "");
          setGraduationUnits(data.graduationUnits ?? "");
        }
      } catch (error) {
        console.error("Error fetching user details: ", error);
      }
    };

    fetchuser();
  }, [userId]);

  // 学部/学科内順位のオプションを生成
  const gradeOptions = Array.from({ length: 200 }, (_, i) => ({
    label: `${i + 1}位`,
    value: `${i + 1}`
  }));

  return (
    <ScrollView>
      <View style={styles.container}>
        <List.Accordion
          title="現在成績"
          expanded={showCurrentGrade}
          onPress={() => setShowCurrentGrade(!showCurrentGrade)}
        >
          <Text style={styles.label}>1. GPA:</Text>
          <TextInput
            style={styles.input}
            placeholder="GPAを入力してください"
            value={GPA}
            onChangeText={setGPA}
          />

          <Text style={styles.label}>2. 学部/学科内順位</Text>
          <Dropdown
            label="学部/学科内順位"
            placeholder="選択してください"
            options={gradeOptions}
            onSelect={setGrade}
            value={grade}
          />

          <Text style={styles.label}>3. 志望社内順位</Text>
          <TextInput
            style={styles.input}
            placeholder="志望社内順位を入力してください"
            value={desiredDeptRank}
            onChangeText={setDesiredDeptRank}
          />

          <Text style={styles.label}>4. 卒業単位</Text>
          <TextInput
            style={styles.input}
            placeholder="卒業単位を入力してください"
            value={graduationUnits}
            onChangeText={setGraduationUnits}
          />
        </List.Accordion>

        <List.Accordion title='成績入力' expanded={true}>

          <Text>成績入力</Text> <TouchableOpacity
          
          onPress={() => navigation.navigate('gradeinput', { userId})}>

          </TouchableOpacity>
        </List.Accordion>


      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#f0f0f0"
  },
  label: {
    fontSize: 16,
    marginVertical: 8
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: "#fff"
  }
});