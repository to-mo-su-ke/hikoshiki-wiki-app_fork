import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { doc, getDoc , collection, query, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../006Configs/firebaseConfig2';
import { doSignOut } from '../../004BackendModules/loginMethod/signOut';

const UserInfoScreen = ({ navigation }) => {
  const [userName, setUserName] = useState(''); // ユーザー名
  const [role, setRole] = useState(''); // ユーザーのロール
  const [grade, setGrade] = useState(''); // 学年
  const [department, setDepartment] = useState(''); // 学科
  const [loading, setLoading] = useState(true); // ローディング状態
  const [error, setError] = useState(null); // エラー状態
  const [Id, setId] = useState(''); // ユーザーID
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState<boolean>(false); // 未読通知の有無
  const [notifications, setNotifications] = useState<Notification[]>([]);
  // サインアウト確認
  const handleSignOut = async () => {
    Alert.alert(
      'サインアウト',
      '本当にサインアウトしますか？',
      [
        {
          text: 'キャンセル',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            await doSignOut();
            navigation.reset({
              index: 0,
              routes: [{ name: "LoginNavigator" }],
            });
          },
          
        },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // Firebase Authから現在のユーザーUIDを取得
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (!currentUser) {
          setError('ユーザーがログインしていません。');
          setLoading(false);
          return;
        }

        const uid = currentUser.uid;
        setId(uid); // ユーザーIDを保存

        // Firestoreの"user"コレクションからユーザー情報を取得
        const userDocRef = doc(db, 'user', uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUserName(userData.username || 'ユーザー名未設定');
          setRole(userData.role || '一般');
          setGrade(userData.grade || '未設定');
          setDepartment(userData.department || '未設定');
        } 
        // else {
        //   setError('ユーザー情報が見つかりません。');
        // }
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError('ユーザー情報の取得中にエラーが発生しました。');
      } finally {
        setLoading(false);
      }
    };
   

      

    
    fetchUserInfo();
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>読み込み中...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* ヘッダー部分 */}
      <View style={styles.header}>
      
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{userName}</Text>
          
        </View>
        <TouchableOpacity style={styles.roleButton}>
          <Text style={styles.roleButtonText}>{role}</Text>
        </TouchableOpacity>
      </View>

      {/* メニューリスト */}
      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            if (!grade || !department) {
              Alert.alert('エラー', '学年または学科情報が不足しています。');
              return;
            }
            navigation.navigate('Gradecheck', { grade, department }); // パラメータを渡して遷移
          }}
        >
          <Text style={styles.menuItem}
          onPress={() => navigation.navigate('GradeInfo')} // 成績確認画面に遷移
          >
            
            成績管理</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}


          onPress={() => navigation.navigate('ShinkanConfirmforuser',{Id})} // 新歓予約確認画面に遷移
          >
          <Text style={styles.menuText}>新歓予約確認</Text> 
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>部活/サークル/団体登録申請</Text>
        </TouchableOpacity>
        {role === 'clubCircleManager' && (
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Administnotification')}
          >
            <Text style={styles.menuText}>お知らせ管理</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Userinfoedit')} // ユーザー情報編集画面に遷移
        >
          <Text style={styles.menuText}>登録情報変更</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>募集中の団体</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>フリマ</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => handleSignOut()} // サインアウト処理
        >
          <Text style={styles.signoutText}>サインアウト</Text>
        </TouchableOpacity>
       
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 10,
  },
  editButton: {
    backgroundColor: '#ddd',
    padding: 5,
    borderRadius: 5,
  },
  editButtonText: {
    fontSize: 16,
  },
  roleButton: {
    marginTop: 10,
    backgroundColor: '#007BFF',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  roleButtonText: {
    color: '#fff',
    fontSize: 16,
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
  signoutText: {
    fontSize: 18,
    color: '#ff0000',
  },
});

export default UserInfoScreen;