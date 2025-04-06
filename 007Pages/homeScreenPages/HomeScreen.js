import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { getAuth } from 'firebase/auth';
import { db } from '../../006Configs/firebaseConfig';
import { collection, query, getDocs } from 'firebase/firestore';
import { homeScreenStyles } from '../../002Styles/homescreenstyles';

// タブコンポーネントのインポート
import HomeTab from "../../003Tabs/homescreenTabs/HomeTab";
import BukatsuTab from "../../003Tabs/homescreenTabs/BukatsuTab";
import SchoolTab from "../../003Tabs/homescreenTabs/SchoolTab";
import SelfTab from "../../003Tabs/homescreenTabs/SelfTab";
import EventTab from "../../003Tabs/homescreenTabs/EventTab";
import MapTab from "../../003Tabs/homescreenTabs/MapTab";

const HomeScreen = ({ navigation }) => {
  const [mainTab, setMainTab] = useState("家");
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!currentUser) {
        console.error("ログインしていません。");
        return;
      }

      try {
        const notificationCollection = collection(db, "Notifications");
        const notificationQuery = query(notificationCollection);
        const notificationSnapshot = await getDocs(notificationQuery);

        const uid = currentUser.uid;
        const hasUnread = notificationSnapshot.docs.some((doc) => {
          const data = doc.data();
          return !data.readBy?.includes(uid);
        });

        setHasUnreadNotifications(hasUnread);
      } catch (error) {
        console.error("通知の取得中にエラーが発生しました:", error);
      }
    };

    fetchNotifications();
  }, [currentUser]);

  // 各タブを直接コンポーネントとして使用するように変更
  const renderMainContent = () => {
    switch (mainTab) {
      case "家":
        return <HomeTab navigation={navigation} />;
      case "学内":
        return <SchoolTab navigation={navigation} />;
      case "部活":
        return <BukatsuTab navigation={navigation} />;
      case "自":
        return <SelfTab navigation={navigation} />;
      case "イベ":
        return <EventTab navigation={navigation} />;
      case "地図":
        return <MapTab navigation={navigation} />;
      default:
        return <Text>コンテンツがありません</Text>;
    }
  };

  return (
    <View style={homeScreenStyles.container}>
      {/* 通知ボタン - 全てのタブで表示 */}
      <TouchableOpacity
        style={homeScreenStyles.notificationButton}
        onPress={() => navigation.navigate("NotificationPage")}
      >
        <Image
          style={homeScreenStyles.mainTabImage}
          source={
            hasUnreadNotifications
              ? require("../../008picture/Notifications_with_dot.png") 
              : require("../../008picture/Notifications.png")
          }
        />
      </TouchableOpacity>

      {/* タブコンテンツ */}
      {renderMainContent()}
        
      {/* メインタブナビゲーション */}
      <View style={homeScreenStyles.mainTabsContainer}>
        <TouchableOpacity
          style={[homeScreenStyles.mainTab, mainTab === "家" && homeScreenStyles.activeTab]}
          onPress={() => setMainTab("家")}
        >
          <Image
            style={homeScreenStyles.mainTabImage}
            source={require("../../008picture/home.png")}
          />
          <Text style={homeScreenStyles.tabText}>家</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[homeScreenStyles.mainTab, mainTab === "部活" && homeScreenStyles.activeTab]}
          onPress={() => setMainTab("部活")}
        >
          <Image
            style={homeScreenStyles.mainTabImage}
            source={require("../../008picture/run.png")}
          />
          <Text style={homeScreenStyles.tabText}>部活</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[homeScreenStyles.mainTab, mainTab === "学内" && homeScreenStyles.activeTab]}
          onPress={() => setMainTab("学内")}
        >
          <Image
            style={homeScreenStyles.mainTabImage}
            source={require("../../008picture/building.png")}
          />
          <Text style={homeScreenStyles.tabText}>学内</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[homeScreenStyles.mainTab, mainTab === "地図" && homeScreenStyles.activeTab]}
          onPress={() => setMainTab("地図")}
        >
          <Image
            style={homeScreenStyles.mainTabImage}
            source={require("../../008picture/map.png")}
          />
          <Text style={homeScreenStyles.tabText}>地図</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[homeScreenStyles.mainTab, mainTab === "イベ" && homeScreenStyles.activeTab]}
          onPress={() => setMainTab("イベ")}
        >
          <Image
            style={homeScreenStyles.mainTabImage}
            source={require("../../008picture/event.png")}
          />
          <Text style={homeScreenStyles.tabText}>イベ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[homeScreenStyles.mainTab, mainTab === "自" && homeScreenStyles.activeTab]}
          onPress={() => setMainTab("自")}
        >
          <Image
            style={homeScreenStyles.mainTabImage}
            source={require("../../008picture/account.png")}
          />
          <Text style={homeScreenStyles.tabText}>自</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;