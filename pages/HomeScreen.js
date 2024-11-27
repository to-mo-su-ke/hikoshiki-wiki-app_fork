import React from "react";
import { View, Button } from "react-native";
import { styles } from "../styles/styles"; // スタイルをインポート

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Button
        title="カレンダー"
        onPress={() => navigation.navigate("Calendar")}
      />
      <View style={styles.buttonSpacing}>
        <Button
          title="ワンデイ"
          onPress={() => navigation.navigate("DayEvents")}
        />
      </View>
    </View>
  );
};

export default HomeScreen;
