import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../006Configs/firebaseConfig';
import { getAuth } from 'firebase/auth';
import ChangePasswordScreen from './ChangePasswordScreen';

const Userinfoedit = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState(null); // ユーザー情報
  const [username, setUsername] = useState('');
  const [grade, setGrade] = useState('');
  const [school, setSchool] = useState('');
  const [department, setDepartment] = useState('');
  const [course, setCourse] = useState('');
  const [major, setMajor] = useState('');
  const [researchroom, setResearchroom] = useState('');
  // const [role, setRole] = useState('');
  const [club, setClub] = useState([]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (!currentUser) {
          Alert.alert('エラー', 'ログインしていません');
          return;
        }

        const uid = currentUser.uid;
        const userDocRef = doc(db, 'user', uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserInfo(userData);
          setUsername(userData.username || '');
          setGrade(userData.grade || '');
          setSchool(userData.school || '');
          setDepartment(userData.department || '');
          setCourse(userData.course || '');
          setMajor(userData.major || '');
          setResearchroom(userData.researchroom || '');
          // setRole(userData.role || '');
          setClub(userData.club || []);
        } else {
          Alert.alert('エラー', 'ユーザー情報が見つかりません');
        }
      } catch (error) {
        console.error('Error fetching user details: ', error);
        Alert.alert('エラー', 'ユーザー情報の取得に失敗しました');
      }
    };

    fetchUserInfo();
  }, []);

  const handleSubmit = async () => {
    if (!username.trim() || !grade.trim() || !school.trim() || !department.trim() || !course.trim() || !major.trim() || !researchroom.trim()) {
      Alert.alert('入力エラー', '全ての項目を入力してください');
      return;
    }

    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        Alert.alert('エラー', 'ログインしていません');
        return;
      }

      const uid = currentUser.uid;
      const userDocRef = doc(db, 'user', uid);

      await updateDoc(userDocRef, {
        username,
        grade,
        school,
        department,
        course,
        major,
        researchroom,
        // role,
        club,
      });

      Alert.alert('成功', 'ユーザー情報が更新されました');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating user details: ', error);
      Alert.alert('エラー', '更新に失敗しました');
    }
  };

  if (!userInfo) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>ユーザー情報を読み込んでいます...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>ユーザー情報の編集</Text>

      <Text style={styles.label}>ユーザー名</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="ユーザー名を入力..."
      />

      <Text style={styles.label}>学年</Text>
      <TextInput
        style={styles.input}
        value={grade}
        onChangeText={setGrade}
        placeholder="学年を入力..."
      />

      <Text style={styles.label}>学部</Text>
      <TextInput
        style={styles.input}
        value={school}
        onChangeText={setSchool}
        placeholder="学部を入力..."
      />

      <Text style={styles.label}>学科</Text>
      <TextInput
        style={styles.input}
        value={department}
        onChangeText={setDepartment}
        placeholder="学科を入力..."
      />

      <Text style={styles.label}>コース</Text>
      <TextInput
        style={styles.input}
        value={course}
        onChangeText={setCourse}
        placeholder="コースを入力..."
      />

      <Text style={styles.label}>専攻</Text>
      <TextInput
        style={styles.input}
        value={major}
        onChangeText={setMajor}
        placeholder="専攻を入力..."
      />

      <Text style={styles.label}>研究室</Text>
      <TextInput
        style={styles.input}
        value={researchroom}
        onChangeText={setResearchroom}
        placeholder="研究室を入力..."
      />

      

      <Text style={styles.label}>部活動</Text>
      <TextInput
        style={styles.input}
        value={club.join(', ')}
        onChangeText={(text) => setClub(text.split(',').map((item) => item.trim()))}
        placeholder="部活動をカンマ区切りで入力..."
      />

      <Button title="更新する" onPress={handleSubmit} />

      <Text style={styles.title}>ユーザー情報</Text>
      <View style={styles.menu}>
        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => navigation.navigate("ChangePasswordScreen")} >
          <Text style={styles.menuText}>パスワード変更</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
  },
  menu: {
    padding: 20,
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  menuText: {
    fontSize: 18,
    color: '#333',
  },
});

export default Userinfoedit;