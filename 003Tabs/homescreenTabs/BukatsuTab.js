import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import ClubSearch from '../../007Pages/01homeScreenPages/02-1club/Clubsearch';
import EventSearch from '../../007Pages/clubEvevntPages/Search';
import { tabStyles, bukatsuTabStyles } from '../../002Styles/homescreenstyles';

const BukatsuTab = ({ navigation }) => {
  const [bukatsuTab, setBukatsuTab] = useState("部活動");

  return (
    <View style={tabStyles.container}>
      <View style={tabStyles.tabsContainer}>
        <TouchableOpacity
          style={[tabStyles.tab, bukatsuTab === "部活動" && tabStyles.activeTab]}
          onPress={() => setBukatsuTab("部活動")}
        >
          <Text style={tabStyles.tabText}>部活動</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[tabStyles.tab, bukatsuTab === "新歓" && tabStyles.activeTab]}
          onPress={() => setBukatsuTab("新歓")}
        >
          <Text style={tabStyles.tabText}>新歓</Text>
        </TouchableOpacity>
      </View>
      <View style={tabStyles.content}>
        {bukatsuTab === "部活動" && <ClubSearch navigation={navigation} />}
        {bukatsuTab === "新歓" && (
          <View style={bukatsuTabStyles.shinkanContainer}>
            <View style={bukatsuTabStyles.shinkanHeader}>
              <Text style={bukatsuTabStyles.shinkanTitle}>新歓イベント</Text>
              <TouchableOpacity 
                style={bukatsuTabStyles.createEventButton}
                onPress={() => navigation.navigate("EventRegist")}
              >
                <Text style={bukatsuTabStyles.createEventButtonText}>新歓を登録</Text>
              </TouchableOpacity>
            </View>
            <EventSearch navigation={navigation} />
          </View>
        )}
      </View>
    </View>
  );
};

export default BukatsuTab;
