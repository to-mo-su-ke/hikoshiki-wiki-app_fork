import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import TimeTable from "../../timetableCreatePages/TimeTable";
import TimeTableView from "../../timetableCreatePages/TimeTableView";

const HomeTab = ({ navigation }) => {
  const [showTimeTable, setShowTimeTable] = useState(true);

  return (
    <View style={styles.homeContentContainer}>
      <TouchableOpacity
        onPress={() => setShowTimeTable(!showTimeTable)}
        style={styles.button}
      >
        <Text style={styles.toggleButtonText}>
          {showTimeTable ? "タイムテーブル編集" : "タイムテーブルビュー表示"}
        </Text>
      </TouchableOpacity>

      {showTimeTable ? (
        <TimeTable navigation={navigation} />
      ) : (
        <TimeTableView navigation={navigation} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  homeContentContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    paddingTop: 60,
  },
  button: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginVertical: 10,
    width: "50%",
    alignItems: "center",
  },
  toggleButtonText: {
    fontSize: 14,
  }
});

export default HomeTab;
