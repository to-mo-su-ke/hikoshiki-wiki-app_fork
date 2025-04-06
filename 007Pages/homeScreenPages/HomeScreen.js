import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { getAuth } from 'firebase/auth';
import { db } from '../../006Configs/firebaseConfig2'; // firebaseConfig2を使用
import { doc, getDoc, collection, query, getDocs, updateDoc } from 'firebase/firestore'; // updateDocを追加
import Colum from "./005event/Colum";
import ColumSearch from "./005event/ColumSearch";
import LunchHome from "../01homeScreenPages/06userhome/inputpages/lunchhome";
import LunchSearch from "../01homeScreenPages/06userhome/inputpages/lunchsearch";
import FreemarketHome from "./003school/Freemarkethome";

const HomeScreen = ({ navigation }) => {
  const [mainTab, setMainTab] = useState("家");
  const [bukatsuTab, setBukatsuTab] = useState("部活動");
  const [schoolTab, setSchoolTab] = useState("学食");
  const [curriculumTab, setCurriculumTab] = useState("授業検索");
  const [selfTab, setSelfTab] = useState("ユーザー");
  const [eventTab, setEventTab] = useState("イベント");


  const [isVerticalTabOpen, setIsVerticalTabOpen] = useState(false);
  const [showTimeTable, setShowTimeTable] = useState(true);
  const [showUserInfo, setShowUserInfo] = useState(true);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false); // 未読通知の有無
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
  
  const renderCurriculumContent = () => {
    return (
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
          {curriculumTab === "授業検索" &&<Classsearch navigation={navigation} />}

          {curriculumTab === "レビュー投稿" && <ClassReviewAdd navigation={navigation} />}
        </View>
      </View>
    );
  };
  
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
          {schoolTab === "学食" && renderLunchcontent() }
          {schoolTab === "フリマ" && renderFreemarketcontent()}
          {schoolTab === "履修" && renderCurriculumContent()}
        </View>
      </View>
    );
  };


  const renderFreemarketcontent = () => {
    return (
      <View style={styles.commonContent}>
        <View style={styles.commonTabsContainer}>
          <TouchableOpacity
            style={[styles.commonTab, curriculumTab === "出品中" && styles.activeTab]}
            onPress={() => setCurriculumTab("出品中")}
          >
            <Text style={styles.tabText}>出品中</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.commonTab, curriculumTab === "取引中" && styles.activeTab]}
            onPress={() => setCurriculumTab("取引中")}
          >
            <Text style={styles.tabText}>取引中</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.commonContent}>
          {curriculumTab === "出品中" && <FreemarketHome navigation={navigation} />}
          {curriculumTab === "取引中" && <LunchSearch navigation={navigation} />}
        </View>
      </View>
    );
  };

        


  const renderLunchcontent = () => {
    return (
      <View style={styles.commonContent}>
        <View style={styles.commonTabsContainer}>
          <TouchableOpacity
            style={[styles.commonTab, curriculumTab === "レビュー投稿/ホーム" && styles.activeTab]}
            onPress={() => setCurriculumTab("レビュー投稿/ホーム")}

          >
            <Text style={styles.tabText}>レビュー投稿/ホーム</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.commonTab, curriculumTab === "レビュー検索" && styles.activeTab]}
            onPress={() => setCurriculumTab("レビュー検索")}
          >
            <Text style={styles.tabText}>レビュー検索</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.commonContent}>
          {curriculumTab === "レビュー投稿/ホーム" &&<LunchHome navigation={navigation} />}

          {curriculumTab === "レビュー検索" && <LunchSearch navigation={navigation} />}
        </View>
      </View>
    );
  };
  
          
  
const renderEventContent = () => {
    return (
      <View style={styles.commonContent}> 
        <View style={styles.commonTabsContainer}>
          <TouchableOpacity
            style={[styles.commonTab, eventTab === "イベント" && styles.activeTab] }
            onPress={() => setEventTab("イベント") }
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
          {eventTab === "イベント" && <Colum navigation={navigation} />}
          {eventTab === "イベント検索" &&<ColumSearch navigation={navigation} />}
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