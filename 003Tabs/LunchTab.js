import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import LunchHome from '../007Pages/01homeScreenPages/06userhome/Lunch/lunchhome';
import LunchSearch from '../007Pages/01homeScreenPages/06userhome/Lunch/lunchsearch';
import { tabStyles } from '../002Styles/homescreenstyles';

const LunchTab = ({ navigation }) => {
  const [lunchTab, setlunchTab] = useState("学食レビュー");

  return (
    <View style={tabStyles.container}>
      <View style={tabStyles.tabsContainer}>
        <TouchableOpacity
          style={[tabStyles.tab, lunchTab === "学食レビュー" && tabStyles.activeTab]}
          onPress={() => setlunchTab("学食レビュー")}
        >
          <Text style={tabStyles.tabText}>学食レビュー</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[tabStyles.tab, lunchTab === "学食検索" && tabStyles.activeTab]}
          onPress={() => setlunchTab("学食検索")}
        >
          <Text style={tabStyles.tabText}>学食検索</Text>
        </TouchableOpacity>
      </View>
      <View style={tabStyles.content}>
        {lunchTab === "学食レビュー" && <LunchHome navigation={navigation} />}
        {lunchTab === "学食検索" && <LunchSearch navigation={navigation} />}
      </View>
    </View>
  );
};

export default LunchTab;
