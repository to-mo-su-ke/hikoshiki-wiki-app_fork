import React, { useState } from "react";
import { View, Text, Button, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native";
import TimeTable from "../timetableCreatePages/TimeTable"; 
import TimeTableView from "../timetableCreatePages/TimeTableView";
import UserInfo from "../userhome/Userinfo";
import ClubSearch from "./002club/Clubsearch";
import ClubDetail from "./002club/Clubdetail";

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
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
      </ScrollView>
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
    backgroundColor: "#f8f9fa",
    paddingTop: 20,
  },
  homeContentContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  notificationButton: {
    position: "absolute",
    top: 10,
    right: 16,
    padding: 10,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 100,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  mainTabsContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderColor: "#e0e0e0",
    justifyContent: "space-around",
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 10,
  },
  mainTab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  mainTabImage: {
    width: 28,
    height: 28,
    marginBottom: 4,
    tintColor: "#475569",
  },
  activeTab: {
    backgroundColor: "#e9f2ff",
    borderRadius: 8,
  },
  commonTabsContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
    justifyContent: "space-around",
    paddingVertical: 8,
    marginBottom: 8,
  },
  commonTab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  commonContent: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 16,
  },
  tabText: {
    fontSize: 12,
    color: "#475569",
    fontWeight: "500",
  },
  verticalTabsContainer: {
    marginTop: 16,
    width: "100%",
    paddingHorizontal: 20,
  },
  verticalTab: {
    width: "100%",
    padding: 15,
    backgroundColor: "#f1f5f9",
    marginVertical: 5,
    alignItems: "center",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  link: {
    width: "100%",
    padding: 15,
    backgroundColor: "#f1f5f9",
    marginVertical: 5,
    alignItems: "center",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  bottun: {
    padding: 12,
    backgroundColor: "#3b82f6",
    borderRadius: 10,
    marginVertical: 16,
    width: "60%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  toggleButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default HomeScreen;