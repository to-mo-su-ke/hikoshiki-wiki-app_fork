import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { doc, getDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { db } from '../../006Configs/firebaseConfig2'; // firebaseConfig2に変更
import { getAuth } from 'firebase/auth'; // ログイン情報を取得するためにimport
import { Picker } from '@react-native-picker/picker';

const ShinkanReserve = ({ route, navigation }) => {
  // 詳細画面から渡されたパラメータを取得
  const { shinkanId, shinkanName, date, location, availableDates: routeAvailableDates } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [shinkan, setShinkan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    email: '',
    phoneNumber: '',
    preferredDate: '',
    comments: '',
  });

  const [availableDates, setAvailableDates] = useState([]);

  useEffect(() => {
    const fetchShinkanDetails = async () => {
      if (!shinkanId) {
        setLoading(false);
        Alert.alert('エラー', 'イベントIDが指定されていません');
        navigation.goBack();
        return;
      }

      try {
        // route.paramsから受け取った利用可能な日程があれば使用
        if (routeAvailableDates && routeAvailableDates.length > 0) {
          setAvailableDates(routeAvailableDates);
          setLoading(false);
          return;
        }

        // なければFirestoreから取得（eventsコレクションに変更）
        const shinkanDocRef = doc(db, 'events', shinkanId);
        const shinkanDoc = await getDoc(shinkanDocRef);

        if (shinkanDoc.exists()) {
          const data = shinkanDoc.data();
          setShinkan({ id: shinkanDoc.id, ...data });

          // 日程データがあれば設定
          if (data.availableDates && data.availableDates.length > 0) {
            setAvailableDates(data.availableDates);
          } else if (data.date) {
            // 単一の日付しかない場合
            const timeStr = data.time ? ` ${data.time}` : '';
            setAvailableDates([`${data.date}${timeStr}`]);
          }

        } else {
          Alert.alert('エラー', '新歓情報が見つかりませんでした。');
          navigation.goBack();
        }
      } catch (error) {
        console.error('Error fetching shinkan details: ', error);
        Alert.alert('エラー', '新歓情報の取得中にエラーが発生しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchShinkanDetails();
  }, [shinkanId, navigation, routeAvailableDates]);

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const validateForm = () => {
    // バリデーションチェック
    if (!formData.name.trim()) {
      Alert.alert('エラー', '名前を入力してください');
      return false;
    }

    if (!formData.studentId.trim()) {
      Alert.alert('エラー', '学籍番号を入力してください');
      return false;
    }

    if (!formData.email.trim()) {
      Alert.alert('エラー', 'メールアドレスを入力してください');
      return false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      Alert.alert('エラー', '有効なメールアドレスを入力してください');
      return false;
    }

    if (!formData.preferredDate) {
      Alert.alert('エラー', '希望日を選択してください');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      // 現在のユーザーIDを取得
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        Alert.alert("エラー", "予約にはログインが必要です");
        setSubmitting(false);
        return;
      }

      // 予約情報をユーザーIDと共に保存
      const reservationData = {
        uid: currentUser.uid,
        name: formData.name,
        studentId: formData.studentId,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        preferredDate: formData.preferredDate,
        comments: formData.comments,
        timestamp: new Date().toISOString(),
      };

      // イベントのmember配列にユーザー情報を追加
      const eventDocRef = doc(db, 'events', shinkanId);
      
      await updateDoc(eventDocRef, {
        member: arrayUnion(reservationData)
      });

      Alert.alert(
        '予約完了',
        '新歓予約が送信されました。',
        [{
          text: 'OK',
          onPress: () => navigation.goBack()
        }]
      );
    } catch (error) {
      console.error('予約送信エラー: ', error);
      Alert.alert('エラー', '予約の送信に失敗しました。再度試してください。');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>読み込み中...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{shinkanName || '新歓イベント'} - 予約</Text>
        </View>

        <View style={styles.formContainer}>
          {/* 開催情報表示セクション */}
          <View style={styles.eventInfoContainer}>
            <Text style={styles.eventInfoTitle}>開催情報</Text>
            <View style={styles.eventInfoItem}>
              <Text style={styles.eventInfoLabel}>日程:</Text>
              <Text style={styles.eventInfoValue}>{date || '詳細は以下で選択'}</Text>
            </View>
            <View style={styles.eventInfoItem}>
              <Text style={styles.eventInfoLabel}>場所:</Text>
              <Text style={styles.eventInfoValue}>{location || '未定'}</Text>
            </View>
          </View>

          {/* 名前 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>名前 <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => handleInputChange('name', text)}
              placeholder="例：山田 太郎"
            />
          </View>

          {/* 学籍番号 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>学籍番号 <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.input}
              value={formData.studentId}
              onChangeText={(text) => handleInputChange('studentId', text)}
              placeholder="例：12345678"
            />
          </View>

          {/* メールアドレス */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>メールアドレス <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              placeholder="例：example@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* 電話番号 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>電話番号（任意）</Text>
            <TextInput
              style={styles.input}
              value={formData.phoneNumber}
              onChangeText={(text) => handleInputChange('phoneNumber', text)}
              placeholder="例：090-1234-5678"
              keyboardType="phone-pad"
            />
          </View>

          {/* 希望日時 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>希望日時 <Text style={styles.required}>*</Text></Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.preferredDate}
                onValueChange={(value) => handleInputChange('preferredDate', value)}
                style={styles.picker}
              >
                <Picker.Item label="選択してください" value="" />
                {availableDates.map((date, index) => (
                  <Picker.Item key={index} label={date} value={date} />
                ))}
              </Picker>
            </View>
          </View>

          {/* コメント */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>質問・コメント（任意）</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.comments}
              onChangeText={(text) => handleInputChange('comments', text)}
              placeholder="質問やコメントがあればご記入ください"
              multiline
              textAlignVertical="top"
              numberOfLines={4}
            />
          </View>

          {/* 送信ボタン */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.submitButtonText}>予約を確定する</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={submitting}
          >
            <Text style={styles.cancelButtonText}>戻る</Text>
          </TouchableOpacity>
        </View>
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
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  required: {
    color: '#ff0000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 120,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    backgroundColor: '#f9f9f9',
  },
  picker: {
    height: 50,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#555',
    fontSize: 16,
  },
  eventInfoContainer: {
    backgroundColor: '#f2f8f2',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#dce8dc',
  },
  eventInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2e7d32',
  },
  eventInfoItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  eventInfoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    width: 60,
  },
  eventInfoValue: {
    fontSize: 16,
    color: '#444',
    flex: 1,
  },
});

export default ShinkanReserve;