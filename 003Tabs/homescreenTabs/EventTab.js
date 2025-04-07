import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
// 修正: フォルダ名をclubEventPagesに変更

import { tabStyles } from '../../002Styles/homescreenstyles';
import Colum from '../../007Pages/01homeScreenPages/06userhome/Colum/Colum';
import ColumSearch from '../../007Pages/01homeScreenPages/06userhome/Colum/ColumSearch';

const EventTab = ({ navigation }) => {
  const [eventTab, setEventTab] = useState("コラム");

  return (
    <View style={tabStyles.container}>
      <View style={tabStyles.tabsContainer}>
        <TouchableOpacity
          style={[tabStyles.tab, eventTab === "コラム" && tabStyles.activeTab]}
          onPress={() => setEventTab("コラム")}
        >
          <Text style={tabStyles.tabText}>コラム</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[tabStyles.tab, eventTab === "コラム検索" && tabStyles.activeTab]}
          onPress={() => setEventTab("コラム検索")}
        >
          <Text style={tabStyles.tabText}>コラム検索</Text>
        </TouchableOpacity>
      </View>
      <View style={tabStyles.content}>
        {eventTab === "コラム" && <Colum navigation={navigation} />}
        {eventTab === "コラム検索" && <ColumSearch　navigation={navigation} />}
      </View>
    </View>
  );
};

export default EventTab;
