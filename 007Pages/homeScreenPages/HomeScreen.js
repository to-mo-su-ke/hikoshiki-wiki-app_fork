import React, { useState } from "react";
import { View, Text, Button, TouchableOpacity, StyleSheet, Image } from "react-native";
import TimeTable from "../timetableCreatePages/TimeTable"; // TimeTableコンポーネントをインポート
import TimeTableView from "../timetableCreatePages/TimeTableView";

const HomeScreen = ({ navigation }) => {
  const [mainTab, setMainTab] = useState("家");
  const [bukatsuTab, setBukatsuTab] = useState("部活動");
  // 新たに学内タブ用の状態
  const [schoolTab, setSchoolTab] = useState("学食");
  // 履修タブ内の状態
  const [curriculumTab, setCurriculumTab] = useState("授業検索");
  // 自タブ用の状態
  const [selfTab, setSelfTab] = useState("ユーザー");
  const [isVerticalTabOpen, setIsVerticalTabOpen] = useState(false);
  const toggleVerticalTab = () => {
    setIsVerticalTabOpen((prev) => !prev);
  };

  const renderTest1Content = () => {
    // ...既存のテスト用コンテンツがあれば
    return (
      <View style={styles.contentContainer}>
        <Text>テスト用の内容</Text>
      </View>
    );
  };
  const [showTimeTable, setShowTimeTable] = useState(true);

  const renderBukatsuContent = () => {
    return (
      <View style={styles.bukatsuContainer}>
        {/* 部活ページの切替タブを画面最上部に配置 */}
        <View style={styles.bukatsuTabsContainer}>
          <TouchableOpacity
            style={[styles.bukatsuTab, bukatsuTab === "部活動" && styles.activeTab]}
            onPress={() => setBukatsuTab("部活動")}
          >
            <Text style={styles.tabText}>部活動</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.bukatsuTab, bukatsuTab === "サークル" && styles.activeTab]}
            onPress={() => setBukatsuTab("サークル")}
          >
            <Text style={styles.tabText}>サークル</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.bukatsuTab, bukatsuTab === "新歓" && styles.activeTab]}
            onPress={() => setBukatsuTab("新歓")}
          >
            <Text style={styles.tabText}>新歓</Text>
          </TouchableOpacity>
        </View>
        {/* 部活タブの内容を表示 */}
        <View style={styles.bukatsuContent}>
          {bukatsuTab === "部活動" && <Text>部活動の内容</Text>}
          {bukatsuTab === "サークル" && <Text>サークルの内容</Text>}
          {bukatsuTab === "新歓" && <Text>新歓の内容</Text>}
        </View>
      </View>
    );
  };

  const renderCurriculumContent = () => {
    return (
      <View style={styles.curriculumContainer}>
        <View style={styles.curriculumTabsContainer}>
          <TouchableOpacity
            style={[styles.curriculumTab, curriculumTab === "授業検索" && styles.activeTab]}
            onPress={() => setCurriculumTab("授業検索")}
          >
            <Text style={styles.tabText}>授業検索</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.curriculumTab, curriculumTab === "レビュー投稿" && styles.activeTab]}
            onPress={() => setCurriculumTab("レビュー投稿")}
          >
            <Text style={styles.tabText}>レビュー投稿</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.curriculumContent}>
          {curriculumTab === "授業検索" && <Text>授業検索の内容</Text>}
          {curriculumTab === "レビュー投稿" && <Text>レビュー投稿の内容</Text>}
        </View>
      </View>
    );
  };

  const renderSchoolContent = () => {
    return (
      <View style={styles.contentContainer}>
        {/* 学内タブの切替（学食/フリマ/履修） */}
        <View style={styles.schoolTabsContainer}>
          <TouchableOpacity
            style={[styles.schoolTab, schoolTab === "学食" && styles.activeTab]}
            onPress={() => setSchoolTab("学食")}
          >
            <Text style={styles.tabText}>学食</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.schoolTab, schoolTab === "フリマ" && styles.activeTab]}
            onPress={() => setSchoolTab("フリマ")}
          >
            <Text style={styles.tabText}>フリマ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.schoolTab, schoolTab === "履修" && styles.activeTab]}
            onPress={() => setSchoolTab("履修")}
          >
            <Text style={styles.tabText}>履修</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.contentContainer}>
          {schoolTab === "学食" && <Text>学食の内容</Text>}
          {schoolTab === "フリマ" && <Text>フリマの内容</Text>}
          {schoolTab === "履修" && renderCurriculumContent()}
        </View>
      </View>
    );
  };

  const renderSelfContent = () => {
    return (
      <View style={styles.contentContainer}>
        {/* 自タブの切替（ユーザー/部活・サークル/団体） */}
        <View style={styles.selfTabsContainer}>
          <TouchableOpacity
            style={[styles.selfTab, selfTab === "ユーザー" && styles.activeTab]}
            onPress={() => setSelfTab("ユーザー")}
          >
            <Text style={styles.tabText}>ユーザー</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.selfTab, selfTab === "部活・サークル" && styles.activeTab]}
            onPress={() => setSelfTab("部活・サークル")}
          >
            <Text style={styles.tabText}>部活・サークル</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.selfTab, selfTab === "団体" && styles.activeTab]}
            onPress={() => setSelfTab("団体")}
          >
            <Text style={styles.tabText}>団体</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.contentContainer}>
          {selfTab === "ユーザー" && <Text>ユーザーの内容</Text>}
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
            {/* ...通知ボタンの内容 */}
          </TouchableOpacity>

          {/* 表示切替用のボタン */}
          <TouchableOpacity
            onPress={() => setShowTimeTable(!showTimeTable)}
            style={styles.toggleButton}
          >
            <Text style={styles.toggleButtonText}>
              {showTimeTable ? "タイムテーブル編集" : "タイムテーブルビュー表示"}
            </Text>
          </TouchableOpacity>
          
          {/* showTimeTable によって表示を切り替え */}
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
      ) : (
        <View style={styles.contentContainer}>
          <Text>その他のコンテンツ</Text>
        </View>
      )}

      {/* 画面下部の水平タブ */}
      <View style={styles.mainTabsContainer}>
        <TouchableOpacity
          style={[styles.mainTab, mainTab === "家" && styles.activeTab]}
          onPress={() => setMainTab("家")}
        >
          <Image
            style={styles.mainTabImage}
            source={require('../../008picture/home.png')}
          />
          <Text style={styles.tabText}>家</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.mainTab, mainTab === "部活" && styles.activeTab]}
          onPress={() => setMainTab("部活")}
        >
          <Image
            style={styles.mainTabImage}
            source={require('../../008picture/run.png')}
          />
          <Text style={styles.tabText}>部活</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.mainTab, mainTab === "学内" && styles.activeTab]}
          onPress={() => setMainTab("学内")}
        >
          <Image
            style={styles.mainTabImage}
            source={require('../../008picture/building.png')}
          />
          <Text style={styles.tabText}>学内</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.mainTab, mainTab === "地図" && styles.activeTab]}
          onPress={() => setMainTab("地図")}
        >
          <Image
            style={styles.mainTabImage}
            source={require('../../008picture/map.png')}
          />
          <Text style={styles.tabText}>地図</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.mainTab, mainTab === "イベ" && styles.activeTab]}
          onPress={() => setMainTab("イベ")}
        >
          <Image
            style={styles.mainTabImage}
            source={require('../../008picture/event.png')}
          />
          <Text style={styles.tabText}>イベ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.mainTab, mainTab === "自" && styles.activeTab]}
          onPress={() => setMainTab("自")}
        >
          <Image
            style={styles.mainTabImage}
            source={require('../../008picture/account.png')}
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
  // 既存の部活用スタイル
  bukatsuContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    height: "100%",
  },
  bukatsuTabsContainer: {
    flexDirection: "row",
    backgroundColor: "#000",
    justifyContent: "space-around",
    gap: 3,
  },
  bukatsuTab: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#ddd",
    paddingVertical: 15,
  },
  bukatsuContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // 学内タブ用スタイル
  schoolTabsContainer: {
    flexDirection: "row",
    backgroundColor: "#000",
    justifyContent: "space-around",
    gap: 3,
    paddingVertical: 10,
  },
  schoolTab: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#ddd",
    paddingVertical: 10,
  },
  // 履修タブ内のスタイル
  curriculumContainer: {
    flexDirection: "column",
    justifyContent: "center",
    // height: "100%",　←この行を削除
  },
  curriculumTabsContainer: {
    flexDirection: "row",
    backgroundColor: "#000",
    justifyContent: "space-around",
    gap: 3,
    paddingVertical: 10,
  },
  curriculumTab: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#ddd",
    paddingVertical: 10,
  },
  curriculumContent: {
    justifyContent: "center",
    alignItems: "center",
    // 必要ならここにpaddingなどで余白を調整
  },
  // 自タブ用スタイル
  selfTabsContainer: {
    flexDirection: "row",
    backgroundColor: "#000",
    justifyContent: "space-around",
    gap: 3,
    paddingVertical: 10,
  },
  selfTab: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#ddd",
    paddingVertical: 10,
  },
  tabText: {
    fontSize: 8,
  },
  // 既存の縦タブ・リンク用スタイル
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
});

export default HomeScreen;