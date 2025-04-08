import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../006Configs/firebaseConfig';
import { getAuth } from 'firebase/auth';

const Administnotification = () => {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [link, setLink] = useState('');

  const handlePostNotification = async () => {
    if (!title || !note || !link) {
      Alert.alert('エラー', 'すべてのフィールドを入力してください。');
      return;
    }

    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        Alert.alert('エラー', 'ログインしていません。');
        return;
      }

      const notificationRef = collection(db, 'Notifications');
      await addDoc(notificationRef, {
        title,
        note,
        link,
        registeredDate: new Date(),
        role: 'superAdministrator', // 投稿者のロールを格納
        createdBy: currentUser.uid, // 投稿者のUIDを格納
     readBy: [], // 誰が読んだかの配列
        dismissedBy:[] // 読まれたかどうかのフラグ
      });
      Alert.alert('成功', 'お知らせを投稿しました。');
      setTitle('');
      setNote('');
      setLink('');
    } catch (error) {
      console.error('Error posting notification:', error);
      Alert.alert('エラー', 'お知らせの投稿に失敗しました。');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>お知らせ投稿</Text>
      <TextInput
        style={styles.input}
        placeholder="タイトル"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="内容"
        value={note}
        onChangeText={setNote}
      />
      <TextInput
        style={styles.input}
        placeholder="リンク"
        value={link}
        onChangeText={setLink}
      />
      <Button title="投稿" onPress={handlePostNotification} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
});

export default Administnotification;