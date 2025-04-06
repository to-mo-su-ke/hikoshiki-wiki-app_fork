import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import EventSearch from '../../007Pages/clubEvevntPages/Search';
import { tabStyles } from '../../002Styles/homescreenstyles';

const EventTab = ({ navigation }) => {
  const [eventTab, setEventTab] = useState("イベント");

  return (
    <View style={tabStyles.container}>
      <View style={tabStyles.tabsContainer}>
        <TouchableOpacity
          style={[tabStyles.tab, eventTab === "イベント" && tabStyles.activeTab]}
          onPress={() => setEventTab("イベント")}
        >
          <Text style={tabStyles.tabText}>イベント</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[tabStyles.tab, eventTab === "イベント検索" && tabStyles.activeTab]}
          onPress={() => setEventTab("イベント検索")}
        >
          <Text style={tabStyles.tabText}>イベント検索</Text>
        </TouchableOpacity>
      </View>
      <View style={tabStyles.content}>
        {eventTab === "イベント" && <Text>イベント</Text>}
        {eventTab === "イベント検索" && <EventSearch navigation={navigation} />}
      </View>
    </View>
  );
};

export default EventTab;
