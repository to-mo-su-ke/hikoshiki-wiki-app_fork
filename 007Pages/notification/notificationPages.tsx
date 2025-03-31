import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { NotificationService, NotificationServiceImpl, Notification } from './notificationService';
import { getAuth } from 'firebase/auth';
import { db } from '../../006Configs/firebaseConfig2'; // firebaseConfig2を使用
import { doc, getDoc, collection, query, getDocs, updateDoc } from 'firebase/firestore'; // updateDocを追加

const notificationService: NotificationService = new NotificationServiceImpl();

export const NotificationPage = ({ navigation }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userRole, setUserRole] = useState<string>('');
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!currentUser) {
        console.error('ログインしていません。');
        return;
      }

      const userDocRef = doc(db, 'user', currentUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        setUserRole(userDoc.data()?.role || '');
      }
    };

    const fetchNotifications = async () => {
      try {
        const notificationCollection = collection(db, 'Notifications');
        const notificationQuery = query(notificationCollection);
        const notificationSnapshot = await getDocs(notificationQuery);

        const fetchedNotifications = notificationSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            registeredDate: data.registeredDate?.toDate
              ? data.registeredDate.toDate()
              : new Date(data.registeredDate),
          };
        }) as Notification[];

        setNotifications(fetchedNotifications);
      } catch (e) {
        console.error('通知の取得中にエラーが発生しました:', e);
      }
    };

    fetchUserRole();
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    if (!currentUser) {
      console.error('ログインしていません。');
      return;
    }

    const uid = currentUser.uid;
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id && !notification.readBy.includes(uid)
          ? { ...notification, readBy: [...notification.readBy, uid] }
          : notification
      )
    );

    // Firestoreに更新
    const notificationRef = doc(db, 'Notifications', id);
    const docSnapshot = await getDoc(notificationRef);
    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      const updatedReadBy = [...(data.readBy || []), uid];
      await updateDoc(notificationRef, { readBy: updatedReadBy }); // updateDocを使用
    }
  };

  const handleDismiss = async (id: string) => {
    if (!currentUser) {
      console.error('ログインしていません。');
      return;
    }

    const uid = currentUser.uid;
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id && !notification.dismissedBy.includes(uid)
          ? { ...notification, dismissedBy: [...notification.dismissedBy, uid] }
          : notification
      )
    );

    // Firestoreに更新
    const notificationRef = doc(db, 'Notifications', id);
    const docSnapshot = await getDoc(notificationRef);
    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      const updatedDismissedBy = [...(data.dismissedBy || []), uid];
      await updateDoc(notificationRef, { dismissedBy: updatedDismissedBy }); // updateDocを使用
    }
  };

  const notificationRenderer = ({ item }: { item: Notification }) => {
    if (item.dismissedBy.includes(currentUser?.uid || '')) {
      return null; // 削除済みの場合は表示しない
    }

    return (
      <View style={styles.notificationItem}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationNote}>{item.note}</Text>
        <Text style={styles.notificationDate}>
          {item.registeredDate instanceof Date
            ? item.registeredDate.toLocaleString()
            : '日付形式が無効です'}
        </Text>
      {item.role === 'superAdministrator' && (
        <Text style={styles.sourceText}>運営より</Text>
      )}
      {item.role === 'clubCircleManager' && (
        <Text style={styles.sourceText}>部活/サークル関係者より</Text>
      )}
        
      
  

        {!item.readBy.includes(currentUser?.uid || '') && (
          <Button
            title="既読にする"
            onPress={() => handleMarkAsRead(item.id)}
            color="#4CAF50"
          />
        )}
        <Button
          title="削除"
          onPress={() => handleDismiss(item.id)}
          color="#F44336"
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>お知らせ</Text>
      <FlatList
        data={notifications}
        renderItem={notificationRenderer}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 16,
  },
  notificationItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  notificationNote: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  notificationDate: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },

  sourceText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    fontStyle: 'italic',
  },
});

export default NotificationPage;