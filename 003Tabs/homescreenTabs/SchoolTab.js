import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import CurriculumTab from './CurriculumTab';
import LunchTab from '../LunchTab';
import FreemarketHome from '../../007Pages/01homeScreenPages/06userhome/FreeMarket/Freemarkethome';
import { tabStyles } from '../../002Styles/homescreenstyles';

const SchoolTab = ({ navigation }) => {
  const [schoolTab, setSchoolTab] = useState("学食");

  return (
    <View style={tabStyles.container}>
      <View style={tabStyles.tabsContainer}>
        <TouchableOpacity
          style={[tabStyles.tab, schoolTab === "学食" && tabStyles.activeTab]}
          onPress={() => setSchoolTab("学食")}
        >
          <Text style={tabStyles.tabText}>学食</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[tabStyles.tab, schoolTab === "フリマ" && tabStyles.activeTab]}
          onPress={() => setSchoolTab("フリマ")}
        >
          <Text style={tabStyles.tabText}>フリマ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[tabStyles.tab, schoolTab === "履修" && tabStyles.activeTab]}
          onPress={() => setSchoolTab("履修")}
        >
          <Text style={tabStyles.tabText}>履修</Text>
        </TouchableOpacity>
      </View>
      <View style={tabStyles.content}>
        {schoolTab === "学食" && <LunchTab navigation={navigation} />}
        {schoolTab === "フリマ" && <FreemarketHome navigation={navigation} />}
        {schoolTab === "履修" && <CurriculumTab navigation={navigation} />}
      </View>
    </View>
  );
};

export default SchoolTab;
