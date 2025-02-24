import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert, ScrollView } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../006Configs/firebaseConfig2';

const EditAndResubmit = ({ navigation }) => {
  const [clubId, setClubId] = useState('');
  const [club, setClub] = useState(null);
  const [name, setName] = useState('');
  const [explain, setExplain] = useState('');

  const fetchClub = async () => {
    if (!clubId.trim()) {
      Alert.alert("エラー", "ClubIdを入力してください");
      return;
    }
    try {
      const clubDocRef = doc(db, 'clubtest', clubId);
      const clubDoc = await getDoc(clubDocRef);
      if (clubDoc.exists()) {
        const clubData = clubDoc.data();
        setClub(clubData);
        setName(clubData.name || '');
        setExplain(clubData.explain || '');
      } else {
        Alert.alert("エラー", "クラブ情報が見つかりませんでした");
        setClub(null);
      }
    } catch (error) {
      console.error('Error fetching club details: ', error);
      Alert.alert("エラー", "クラブ情報の取得に失敗しました");
      setClub(null);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !explain.trim()) {
      Alert.alert("入力エラー", "全ての項目を入力してください");
      return;
    }

    try {
      const clubDocRef = doc(db, 'clubtest', clubId);
      await updateDoc(clubDocRef, {
        name: name,
        explain: explain,
      });
      Alert.alert("成功", "クラブ情報が更新されました");
      navigation.goBack();
    } catch (error) {
      console.error('Error updating club details: ', error);
      Alert.alert("エラー", "更新に失敗しました");
    }
  };

  // Club情報が未取得の場合、ClubIdの入力画面を表示
  if (!club) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>クラブ情報検索</Text>
        <TextInput
          style={styles.input}
          value={clubId}
          onChangeText={setClubId}
          placeholder="ClubIdを入力..."
          autoCapitalize="none"
          placeholderTextColor="#aaa"
        />
        <Button title="検索" onPress={fetchClub} />
      </View>
    );
  }

  // Club情報取得後、編集画面を表示
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>部活動情報の編集</Text>
      <Text style={styles.label}>部活動名</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="部活動名を入力..."
      />
      <Text style={styles.label}>説明</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={explain}
        onChangeText={setExplain}
        placeholder="説明を入力..."
        multiline
      />
      <Button title="再送信" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
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
});

export default EditAndResubmit;