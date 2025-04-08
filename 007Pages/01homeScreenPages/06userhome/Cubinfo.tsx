import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../006Configs/firebaseConfig';

const ClubInfo = ({ navigation }) => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (!currentUser) {
          Alert.alert('エラー', 'ログインしていません');
          return;
        }

        const uid = currentUser.uid;

        // Firestoreからログインユーザーが登録した部活を取得
        const clubsRef = collection(db, 'clubtest');
        const q = query(clubsRef, where('createdBy', '==', uid));
        const querySnapshot = await getDocs(q);

        const userClubs = [];
        querySnapshot.forEach((doc) => {
          userClubs.push({ id: doc.id, ...doc.data() });
        });

        setClubs(userClubs);
      } catch (error) {
        console.error('Error fetching clubs:', error);
        Alert.alert('エラー', '部活情報の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>読み込み中...</Text>
      </View>
    );
  }

  if (clubs.length === 0) {
    return (
      <View style={styles.container}>
        <Text>登録された部活がありません。</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>登録した部活</Text>
      {clubs.map((club) => (
        <View key={club.id} style={styles.clubItem}>
          <Text style={styles.clubName}>{club.searchText}</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('ClubMakeEdit', { docId: club.id })}
          >
            <Text style={styles.editButtonText}>編集する</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  clubItem: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  clubName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ClubInfo;