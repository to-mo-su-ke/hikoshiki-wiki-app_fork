import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import UserInfo from '../../007Pages/01homeScreenPages/06userhome/Userinfo';
import ClubInfo from '../../007Pages/01homeScreenPages/06userhome/Cubinfo';
import ShinkanInfo from '../../007Pages/01homeScreenPages/06userhome/Shinkaninfo';
import { tabStyles } from '../../002Styles/homescreenstyles';

const SelfTab = ({ navigation }) => {
  const [selfTab, setSelfTab] = useState("ユーザー");

  return (
    <View style={tabStyles.container}>
      <View style={tabStyles.tabsContainer}>
        <TouchableOpacity
          style={[tabStyles.tab, selfTab === "ユーザー" && tabStyles.activeTab]}
          onPress={() => setSelfTab("ユーザー")}
        >
          <Text style={tabStyles.tabText}>ユーザー</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[tabStyles.tab, selfTab === "部活・サークル" && tabStyles.activeTab]}
          onPress={() => setSelfTab("部活・サークル")}
        >
          <Text style={tabStyles.tabText}>部活・サークル</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[tabStyles.tab, selfTab === "新歓" && tabStyles.activeTab]}
          onPress={() => setSelfTab("新歓")}
        >
          <Text style={tabStyles.tabText}>新歓</Text>
        </TouchableOpacity>
      </View>
      <View style={tabStyles.content}>
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

export default SelfTab;
