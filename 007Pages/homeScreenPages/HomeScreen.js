import React, { useState } from "react";
import { View, Text, Button, TouchableOpacity, StyleSheet, Image } from "react-native";
import TimeTable from "../timetableCreatePages/TimeTable"; 
import TimeTableView from "../timetableCreatePages/TimeTableView";
import UserInfo from "../userhome/Userinfo";
import ClubSearch from "./Clubsearch";
import ClubDetail from "./Clubdetail"; // 追加

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

  const toggleVerticalTab = () => {
    setIsVerticalTabOpen((prev) => !prev);
  };

  const renderTest1Content = () => {
    return (
      <View style={styles.contentContainer}>
        <Text>テスト用の内容</Text>
      </View>
    );
  };

  const renderBukatsuContent = () => {
    return (
      <View style={styles.commonContent}>
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
        <View style={styles.commonContent}>
          {bukatsuTab === "部活動" && <ClubSearch navigation={navigation} />}
          {bukatsuTab === "新歓" && <Text>新歓の内容</Text>}
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
          {curriculumTab === "授業検索" && <Text>授業検索の内容</Text>}
          {curriculumTab === "レビュー投稿" && <Text>レビュー投稿の内容</Text>}
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
          {schoolTab === "学食" && <Text>学食の内容</Text>}
          {schoolTab === "フリマ" && <Text>フリマの内容</Text>}
          {schoolTab === "履修" && renderCurriculumContent()}
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
            style={[styles.commonTab, selfTab === "団体" && styles.activeTab]}
            onPress={() => setSelfTab("団体")}
          >
            <Text style={styles.tabText}>団体</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.commonContent}>
          {selfTab === "ユーザー" && <UserInfo navigation={navigation} />}
          {selfTab === "部活・サークル" && <Text>部活・サークルの内容</Text>}
          {selfTab === "団体" && <Text>団体の内容</Text>}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* メインタブのコンテンツ */}
      {mainTab === "家" ? (
        <View style={styles.homeContentContainer}>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => navigation.navigate("Notification")}
          >
          <Image 
            style={styles.mainTabImage}
            source={require("../../008picture/Notifications.png")}
          />
            {/* ...通知ボタンの内容 */}
          </TouchableOpacity>

          {/* 表示切替用のボタン */}
          <TouchableOpacity
            onPress={() => setShowTimeTable(!showTimeTable)}
            style={styles.bottun}
          >
            <Text style={styles.toggleButtonText}>
              {showTimeTable ? "タイムテーブル編集" : "タイムテーブルビュー表示"}
            </Text>
          </TouchableOpacity>

          {showTimeTable ? (
            <TimeTable navigation={navigation} />
          ) : (
            <TimeTableView navigation={navigation} />
          )}
        </View>
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
        

      {/* 画面下部の水平タブ */}
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
  homeContentContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    paddingTop: 60,
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
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mainTabsContainer: {
    flexDirection: "row",
    backgroundColor: "#000",
    justifyContent: "space-around",
    gap: 3,
    paddingVertical: 0, // 修正
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
  // 共通のタブスタイル
  commonTabsContainer: {
    flexDirection: "row",
    backgroundColor: "#000",
    justifyContent: "space-around",
    gap: 3,
    paddingVertical: 3, // 修正
  },
  commonTab: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#ddd",
    paddingVertical: 15,
  },
  commonContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabText: {
    fontSize: 8,
  },
  // 縦タブ・リンク用スタイル
  verticalTabsContainer: {
    marginTop: 10,
    width: "100%",
    paddingHorizontal: 20,
  },
  verticalTab: {
    width: "100%",
    padding: 15,
    backgroundColor: "#ccc",
    marginVertical: 5,
    alignItems: "center",
  },
  link: {
    width: "100%",
    padding: 15,
    backgroundColor: "#ccc",
    marginVertical: 5,
    alignItems: "center",
  },
  // ボタンスタイル
  bottun: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginVertical: 10,
    width: "50%",
    alignItems: "center",

  },
});


export default HomeScreen;