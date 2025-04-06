import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { getAuth } from 'firebase/auth';
import { db } from '../../006Configs/firebaseConfig';
import { collection, query, getDocs, updateDoc, doc } from 'firebase/firestore';

const NotificationPage = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    if (!currentUser) {
      console.error("ログインしていません。");
      return;
    }

    try {
      const notificationCollection = collection(db, "Notifications");
      const notificationQuery = query(notificationCollection);
      const notificationSnapshot = await getDocs(notificationQuery);

      const notificationList = notificationSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        read: doc.data().readBy?.includes(currentUser.uid) || false
      }));

      setNotifications(notificationList.sort((a, b) => b.createdAt - a.createdAt));
    } catch (error) {
      console.error("通知の取得中にエラーが発生しました:", error);
    }
  };

  const markAsRead = async (notificationId) => {
    if (!currentUser) return;

    try {
      const notificationRef = doc(db, "Notifications", notificationId);
      const notification = notifications.find(n => n.id === notificationId);
      
      const readBy = notification.readBy || [];
      if (!readBy.includes(currentUser.uid)) {
        await updateDoc(notificationRef, {
          readBy: [...readBy, currentUser.uid]
        });
        
        // 更新してリストを再読み込み
        fetchNotifications();
      }
    } catch (error) {
      console.error("通知の既読処理中にエラーが発生しました:", error);
    }
  };

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.notificationItem, item.read ? styles.readNotification : styles.unreadNotification]}
      onPress={() => markAsRead(item.id)}
    >
      <Text style={styles.notificationTitle}>{item.title}</Text>
      <Text style={styles.notificationMessage}>{item.message}</Text>
      <Text style={styles.notificationDate}>
        {item.createdAt ? new Date(item.createdAt.toDate()).toLocaleString() : '日付不明'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>通知</Text>
      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.emptyText}>通知はありません</Text>
      )}
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
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  listContainer: {
    paddingBottom: 20,
  },
  notificationItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unreadNotification: {
    borderLeftColor: '#3498db',
    backgroundColor: '#f0f8ff',
  },
  readNotification: {
    borderLeftColor: '#95a5a6',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#2c3e50',
  },
  notificationMessage: {
    fontSize: 14,
    marginBottom: 8,
    color: '#34495e',
  },
  notificationDate: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'right',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#95a5a6',
  }
});

export default NotificationPage;
