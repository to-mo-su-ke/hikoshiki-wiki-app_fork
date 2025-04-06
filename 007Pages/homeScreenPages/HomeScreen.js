import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { getAuth } from 'firebase/auth';
import { db } from '../../006Configs/firebaseConfig';
import { collection, query, getDocs } from 'firebase/firestore';

// タブコンポーネントのインポート
import HomeTab from "./tabs/HomeTab";

// その他のタブは必要に応じて分割・修正予定
import UserInfo from "../userhome/Userinfo";
import ClubSearch from "./002club/Clubsearch";
import ClubInfo from "../userhome/Cubinfo";
import ShinkanInfo from "../userhome/Shinkaninfo";
import EventSearch from "../clubEvevntPages/Search";
import Classsearch from "./Class/Classsearch";
import ClassReviewAdd from "./Class/Classrreviewadd";

const HomeScreen = ({ navigation }) => {
  const [mainTab, setMainTab] = useState("家");
  const [bukatsuTab, setBukatsuTab] = useState("部活動");
  const [schoolTab, setSchoolTab] = useState("学食");
  const [curriculumTab, setCurriculumTab] = useState("授業検索");
  const [selfTab, setSelfTab] = useState("ユーザー");
  const [eventTab, setEventTab] = useState("イベント");
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

  const renderSchoolContent = () => {
    return (
      <View style={styles.commonContent}>
        <View style={styles.commonTabsContainer}>
          <TouchableOpacity
            style={[styles.commonTab, schoolTab === "学食" && styles.activeTab]}
            onPress={() => setSchoolTab("学食")}
          >
            <Text style={styles.tabText}>学食</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.commonTab, schoolTab === "フリマ" && styles.activeTab]}
            onPress={() => setSchoolTab("フリマ")}
          >
            <Text style={styles.tabText}>フリマ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.commonTab, schoolTab === "履修" && styles.activeTab]}
            onPress={() => setSchoolTab("履修")}
          >
            <Text style={styles.tabText}>履修</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.commonContent}>
          {schoolTab === "学食" && <Text>学食の内容</Text>}
          {schoolTab === "フリマ" && <Text>フリマの内容</Text>}
          {schoolTab === "履修" && (
            <View style={styles.commonContent}>
              <View style={styles.commonTabsContainer}>
                <TouchableOpacity
                  style={[styles.commonTab, curriculumTab === "授業検索" && styles.activeTab]}
                  onPress={() => setCurriculumTab("授業検索")}
                >
                  <Text style={styles.tabText}>授業検索</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.commonTab, curriculumTab === "レビュー投稿" && styles.activeTab]}
                  onPress={() => setCurriculumTab("レビュー投稿")}
                >
                  <Text style={styles.tabText}>レビュー投稿</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.commonContent}>
                {curriculumTab === "授業検索" && <Classsearch navigation={navigation} />}
                {curriculumTab === "レビュー投稿" && <ClassReviewAdd navigation={navigation} />}
              </View>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderBukatsuContent = () => {
    return (
      <View style={styles.bukatsuContentContainer}>
        <View style={styles.commonTabsContainer}>
          <TouchableOpacity
            style={[styles.commonTab, bukatsuTab === "部活動" && styles.activeTab]}
            onPress={() => setBukatsuTab("部活動")}
          >
            <Text style={styles.tabText}>部活動</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.commonTab, bukatsuTab === "新歓" && styles.activeTab]}
            onPress={() => setBukatsuTab("新歓")}
          >
            <Text style={styles.tabText}>新歓</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bukatsuTabContent}>
          {bukatsuTab === "部活動" && <ClubSearch navigation={navigation} />}
          {bukatsuTab === "新歓" && (
            <View style={styles.shinkanContainer}>
              <View style={styles.shinkanHeader}>
                <Text style={styles.shinkanTitle}>新歓イベント</Text>
                <TouchableOpacity 
                  style={styles.createEventButton}
                  onPress={() => navigation.navigate("EventRegist")}
                >
                  <Text style={styles.createEventButtonText}>新歓を登録</Text>
                </TouchableOpacity>
              </View>
              <EventSearch navigation={navigation} />
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderSelfContent = () => {
    return (
      <View style={styles.commonContent}>
        <View style={styles.commonTabsContainer}>
          <TouchableOpacity
            style={[styles.commonTab, selfTab === "ユーザー" && styles.activeTab]}
            onPress={() => setSelfTab("ユーザー")}
          >
            <Text style={styles.tabText}>ユーザー</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.commonTab, selfTab === "部活・サークル" && styles.activeTab]}
            onPress={() => setSelfTab("部活・サークル")}
          >
            <Text style={styles.tabText}>部活・サークル</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.commonTab, selfTab === "新歓" && styles.activeTab]}
            onPress={() => setSelfTab("新歓")}
          >
            <Text style={styles.tabText}>新歓</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.commonContent}>
          {selfTab === "ユーザー" ? (
            <UserInfo navigation={navigation} />
          ) : selfTab === "部活・サークル" ? (
            <ClubInfo navigation={navigation} />
          ) : selfTab === "新歓" ? (
            <ShinkanInfo navigation={navigation} />
          ) : (
            <Text>遷移してない</Text>
          )}
        </View>
      </View>
    );
  };

  const renderEventContent = () => {
    return (
      <View style={styles.commonContent}> 
        <View style={styles.commonTabsContainer}>
          <TouchableOpacity
            style={[styles.commonTab, eventTab === "イベント" && styles.activeTab]}
            onPress={() => setEventTab("イベント")}
          >
            <Text style={styles.tabText}>イベント</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.commonTab, eventTab === "イベント検索" && styles.activeTab]}
            onPress={() => setEventTab("イベント検索")}
          >
            <Text style={styles.tabText}>イベント検索</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.commonContent}>
          {eventTab === "イベント" && <Text>イベント</Text>}
          {eventTab === "団体募集" && <Text>団体募集</Text>}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 通知ボタン - 全てのタブで表示 */}
      <TouchableOpacity
        style={styles.notificationButton}
        onPress={() => navigation.navigate("NotificationPage")}
      >
        <Image
          style={styles.mainTabImage}
          source={
            hasUnreadNotifications
              ? require("../../008picture/Notifications_with_dot.png") 
              : require("../../008picture/Notifications.png")
          }
        />
      </TouchableOpacity>

      {/* タブコンテンツ */}
      {mainTab === "家" ? (
        <HomeTab navigation={navigation} />
      ) : mainTab === "学内" ? (
        renderSchoolContent()
      ) : mainTab === "部活" ? (
        renderBukatsuContent()
      ) : mainTab === "自" ? (
        renderSelfContent()
      ) : mainTab === "イベ" ? (
        renderEventContent()
      ) : (
        <Text>地図の内容</Text>
      )}
        
      {/* メインタブナビゲーション */}
      <View style={styles.mainTabsContainer}>
        <TouchableOpacity
          style={[styles.mainTab, mainTab === "家" && styles.activeTab]}
          onPress={() => setMainTab("家")}
        >
          <Image
            style={styles.mainTabImage}
            source={require("../../008picture/home.png")}
          />
          <Text style={styles.tabText}>家</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.mainTab, mainTab === "部活" && styles.activeTab]}
          onPress={() => setMainTab("部活")}
        >
          <Image
            style={styles.mainTabImage}
            source={require("../../008picture/run.png")}
          />
          <Text style={styles.tabText}>部活</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.mainTab, mainTab === "学内" && styles.activeTab]}
          onPress={() => setMainTab("学内")}
        >
          <Image
            style={styles.mainTabImage}
            source={require("../../008picture/building.png")}
          />
          <Text style={styles.tabText}>学内</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.mainTab, mainTab === "地図" && styles.activeTab]}
          onPress={() => setMainTab("地図")}
        >
          <Image
            style={styles.mainTabImage}
            source={require("../../008picture/map.png")}
          />
          <Text style={styles.tabText}>地図</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.mainTab, mainTab === "イベ" && styles.activeTab]}
          onPress={() => setMainTab("イベ")}
        >
          <Image
            style={styles.mainTabImage}
            source={require("../../008picture/event.png")}
          />
          <Text style={styles.tabText}>イベ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.mainTab, mainTab === "自" && styles.activeTab]}
          onPress={() => setMainTab("自")}
        >
          <Image
            style={styles.mainTabImage}
            source={require("../../008picture/account.png")}
          />
          <Text style={styles.tabText}>自</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  notificationButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
    zIndex: 100,
  },
  mainTabsContainer: {
    flexDirection: "row",
    backgroundColor: "#000",
    justifyContent: "space-around",
    gap: 3,
    paddingVertical: 0,
  },
  mainTab: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#ddd",
    paddingVertical: 5,
  },
  mainTabImage: {
    width: 32,
    height: 32,
  },
  activeTab: {
    backgroundColor: "#aaa",
  },
  commonTabsContainer: {
    flexDirection: "row",
    backgroundColor: "#000",
    justifyContent: "space-around",
    gap: 3,
    paddingVertical: 3,
  },
  commonTab: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#ddd",
    paddingVertical: 15,
  },
  commonContent: {
    flex: 1,
  },
  tabText: {
    fontSize: 8,
  },
  bottun: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginVertical: 10,
    width: "50%",
    alignItems: "center",
  },
  bukatsuContentContainer: {
    flex: 1,
    width: '100%',
  },
  bukatsuTabContent: {
    flex: 1,
    width: '100%',
  },
  shinkanContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 0,
  },
  shinkanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    width: '100%',
  },
  shinkanTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  createEventButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  createEventButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 12,
  },
});

export default HomeScreen;