import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../006Configs/firebaseConfig2'; // 他のファイルからインポート。firebase設定済みのdbインスタンスを参照してください
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

interface UserData {
  name?: string;
  departure?: string;
  // 他のフィールドがあればここに追加
}

const UserInfo = () => {
  const [user, setUser] = useState<UserData>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // Firebase上の"user"ディレクトリからユーザー情報を取得
        // "currentUserId"部分は実際のユーザーIDに置き換えてください

        const userDocRef = doc(db, 'user', 'currentUserId');//ログイン時に取得したユーザーIDを入れるので任せた
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setUser(userDocSnap.data() as UserData);
        } else {
          setError('ユーザー情報が存在しません。');
        }
      } catch (err) {
        setError('ユーザー情報の取得に失敗しました。');
      }
      setLoading(false);
    };

    fetchUserInfo();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>{error}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>ユーザー情報</Text>
      <Text>名前: {user.name}</Text>
      <Text>学科: {user.departure}</Text>
      {/* 他のフィールドも必要に応じて表示 */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default UserInfo;