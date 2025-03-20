import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../006Configs/firebaseConfig';

const ShinkanDetail = ({ route, navigation }) => {
  // Searchページから渡されたshinkanIdパラメータを取得
  const { shinkanId } = route.params || {};
  const [shinkan, setShinkan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShinkanDetails = async () => {
      if (!shinkanId) {
        setLoading(false);
        Alert.alert('エラー', 'イベントIDが指定されていません');
        return;
      }

      try {
        // 'shinkantest' コレクションから指定IDのドキュメントを取得
        const shinkanDocRef = doc(db, 'shinkantest', shinkanId);
        const shinkanDoc = await getDoc(shinkanDocRef);

        if (shinkanDoc.exists()) {
          const data = shinkanDoc.data();
          setShinkan({
            id: shinkanDoc.id,
            name: data.name || '名称未設定',
            explain: data.explain || '説明なし',
            date: data.date || data.eventDate ? new Date(data.eventDate.toDate()).toLocaleDateString() : '日程未定',
            location: data.location || '場所未定',
            cost: data.cost || 0,
            // 予約に必要なその他の情報
            availableDates: data.availableDates || []
          });
        } else {
          Alert.alert('エラー', '新歓情報が見つかりませんでした。');
        }
      } catch (error) {
        console.error('Error fetching shinkan details: ', error);
        Alert.alert('エラー', '新歓情報の取得中にエラーが発生しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchShinkanDetails();
  }, [shinkanId]);

  // 予約画面に遷移する関数
  const handleReservation = () => {
    if (!shinkan) return;

    navigation.navigate('ShinkanReserve', {
      shinkanId: shinkan.id,
      shinkanName: shinkan.name,
      // 予約画面で表示するために追加情報を渡す
      date: shinkan.date,
      location: shinkan.location,
      availableDates: shinkan.availableDates
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>読み込み中...</Text>
      </View>
    );
  }

  if (!shinkan) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>新歓情報が見つかりませんでした</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>戻る</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.shinkanName}>{shinkan.name}</Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>新歓内容</Text>
          <Text style={styles.explainText}>{shinkan.explain}</Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>新歓日程</Text>
          <Text style={styles.infoText}>{shinkan.date}</Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>場所</Text>
          <Text style={styles.infoText}>{shinkan.location}</Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>参加費</Text>
          <Text style={styles.infoText}>{shinkan.cost}円</Text>
        </View>

        <TouchableOpacity
          style={styles.reservationButton}
          onPress={handleReservation}
        >
          <Text style={styles.reservationButtonText}>予約する</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backToListButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backToListButtonText}>一覧に戻る</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  headerContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
  },
  shinkanName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  sectionContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  explainText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  infoText: {
    fontSize: 16,
    color: '#444',
  },
  reservationButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  reservationButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#9E9E9E',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 16,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backToListButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  backToListButtonText: {
    color: '#666',
    fontSize: 16,
  },
});

export default ShinkanDetail;