import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Classsearch from '../../007Pages/01homeScreenPages/06userhome/Class/Classsearch';
import ClassReviewAdd from '../../007Pages/01homeScreenPages/06userhome/Class/Classrreviewadd';
import { tabStyles } from '../../002Styles/homescreenstyles';

const CurriculumTab = ({ navigation }) => {
  const [curriculumTab, setCurriculumTab] = useState("授業検索");

  return (
    <View style={tabStyles.container}>
      <View style={tabStyles.tabsContainer}>
        <TouchableOpacity
          style={[tabStyles.tab, curriculumTab === "授業検索" && tabStyles.activeTab]}
          onPress={() => setCurriculumTab("授業検索")}
        >
          <Text style={tabStyles.tabText}>授業検索</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[tabStyles.tab, curriculumTab === "レビュー投稿" && tabStyles.activeTab]}
          onPress={() => setCurriculumTab("レビュー投稿")}
        >
          <Text style={tabStyles.tabText}>レビュー投稿</Text>
        </TouchableOpacity>
      </View>
      <View style={tabStyles.content}>
        {curriculumTab === "授業検索" && <Classsearch navigation={navigation} />}
        {curriculumTab === "レビュー投稿" && <ClassReviewAdd navigation={navigation} />}
      </View>
    </View>
  );
};

export default CurriculumTab;
