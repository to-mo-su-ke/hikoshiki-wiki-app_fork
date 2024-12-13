import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ホーム画面</Text>
      <Button
        title="情報入力ページへ"
        onPress={() => navigation.navigate("Input")}
      />
      <Button
        title="新規登録ページへ"
        onPress={() => navigation.navigate("送信モデル画面")}
      />
      <Button
        title="RNPtest"
        onPress={() => navigation.navigate("RNPtest")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default HomeScreen;
