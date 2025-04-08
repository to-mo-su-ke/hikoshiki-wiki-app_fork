import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import CurriculumTab from './CurriculumTab';
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
        {schoolTab === "学食" && <Text>学食の内容</Text>}
        {schoolTab === "フリマ" && <Text>フリマの内容</Text>}
        {schoolTab === "履修" && <CurriculumTab navigation={navigation} />}
      </View>
    </View>
  );
};

export default SchoolTab;
