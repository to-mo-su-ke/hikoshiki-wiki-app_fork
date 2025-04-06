import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import TimeTable from "../../007Pages/timetableCreatePages/TimeTable";
import TimeTableView from "../../007Pages/timetableCreatePages/TimeTableView";
import { homeTabStyles } from "../../002Styles/homescreenstyles";

const HomeTab = ({ navigation }) => {
  const [showTimeTable, setShowTimeTable] = useState(true);

  return (
    <View style={homeTabStyles.homeContentContainer}>
      <TouchableOpacity
        onPress={() => setShowTimeTable(!showTimeTable)}
        style={homeTabStyles.button}
      >
        <Text style={homeTabStyles.toggleButtonText}>
          {showTimeTable ? "タイムテーブル編集" : "タイムテーブルビュー表示"}
        </Text>
      </TouchableOpacity>

      <ScrollView 
        style={homeTabStyles.scrollView}
        contentContainerStyle={homeTabStyles.scrollViewContent}
        showsVerticalScrollIndicator={true}
      >
        {showTimeTable ? (
          <TimeTable navigation={navigation} />
        ) : (
          <TimeTableView navigation={navigation} />
        )}
      </ScrollView>
    </View>
  );
};

export default HomeTab;
