import React from "react";
import { View, Button } from "react-native";
import { styles } from "../styles/styles"; // スタイルをインポート

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Button
        title="写真をアップロード"
        onPress={() => navigation.navigate("PhotoUpload")}
      />
      <View style={styles.buttonSpacing}>
        <Button
          title="情報送信フォーム"
          onPress={() => navigation.navigate("InformationForm")}
        />
      </View>
    </View>
  );
};

export default HomeScreen;
