import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import AppNavigator from "./component/messagerouting"; // AppNavigatorのパスを確認
import LoginWithEmail from "./login";

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Hello</Text>

      <AppNavigator />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
