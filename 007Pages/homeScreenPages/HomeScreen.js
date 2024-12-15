import React, { useState } from "react";
import { View, Text, Button, TouchableOpacity, StyleSheet,Image } from "react-native";


const HomeScreen = ({ navigation }) => {
  const [mainTab, setMainTab] = useState("家");
  const [test1Tab, setTest1Tab] = useState("送信");
  const [isVerticalTabOpen, setIsVerticalTabOpen] = useState(false);

  const toggleVerticalTab = () => {
    setIsVerticalTabOpen((prev) => !prev);
  };


  const renderTest1Content = () => {
    if (test1Tab === "送信") {
      return (
        <View style={styles.contentContainer}>
          {/* ここでタブ切替ボタンを表示 */}
          <TouchableOpacity
            style={styles.verticalTab}
            onPress={toggleVerticalTab}
          >

          <Text>Inputページのリンクを表示</Text>

            
          </TouchableOpacity>
          {/* タブが開いている場合のみリンクを表示 */}
          {isVerticalTabOpen && (
            <View style={styles.verticalTabsContainer}>
              <TouchableOpacity
                style={styles.link}
                onPress={() => navigation.navigate("Input")}
              >
                <Text>Inputページへのリンク</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.link}>
                <Text>その他のリンク（サンプル）</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      );
    } else {
      return <Text>受信タブの内容</Text>;
    }
  };


  return (
    <View style={styles.container}>
      {/* テスト1タブのコンテンツ */}
      {mainTab === "家" ? (
        <View style={styles.test1Container}>
          {/* テスト1の上部水平タブ */}
          <View style={styles.test1TabsContainer}>
            <TouchableOpacity
              style={[styles.test1Tab, test1Tab === "送信" && styles.activeTab]}
              onPress={() => setTest1Tab("送信")}
            >
              <Text style={styles.tabText}>送信</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.test1Tab, test1Tab === "受信" && styles.activeTab]}
              onPress={() => setTest1Tab("受信")}
            >
              <Text style={styles.tabText}>受信</Text>
            </TouchableOpacity>
          </View>
          {/* テスト1タブの内容 */}
          {renderTest1Content()}
        </View>
      ) : (
        <View style={styles.contentContainer}>
          <Text>テスト2のコンテンツ（サンプル）</Text>
        </View>
      )}

      {/* 画面下部の水平タブ */}
      <View style={styles.mainTabsContainer}>
        {/* 家 */}
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
        {/* 部活 */}
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
        {/* 学内 */}
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
        {/* 地図 */}
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
        {/* イベ */}
        <TouchableOpacity
          style={[styles.mainTab, mainTab === "イベ" && styles.activeTab]}
          onPress={() => setMainTab("イベイベ")}
        >
          <Image
            style={styles.mainTabImage}
            source={require('../../008picture/event.png')}
          />

          <Text style={styles.tabText}>イベ</Text>
        
        </TouchableOpacity>
        {/* 自 */}
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
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mainTabsContainer: {
    flexDirection: "row",
    backgroundColor: "#000",
    justifyContent: "space-around",
    // paddingVertical: 5,
    gap: 3
  },
  mainTab: {
    flex: 1,
    // padding: 15,
    // height: 50,
    alignItems: "center",
    backgroundColor: "#ddd",
    paddingVertical: 5
  },
  mainTabImage: {
    width: 32,
    height: 32,
    // resizeMode: "cover",
    // backgroundColor: "#fff"
  },
  test1Container: {
    flex: 1,
    paddingTop: 10,
  },
  test1TabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#eee",
    paddingVertical: 10,
  },
  test1Tab: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#aaa",
  },
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
  tabText: {
    fontSize: 8,
  },
});

export default HomeScreen;
