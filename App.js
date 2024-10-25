import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginWithEmail from "./login"; // ログインコンポーネント
import SearchScreen from "./component0/namesearch"; // 名前検索コンポーネント
import TagSearch from "./component0/tagsearch"; // タグ検索コンポーネント

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="TagSearch" component={TagSearch} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

// HomeScreenコンポーネントの作成
const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Hello</Text>
      <Button
        title="Go to Tag Search"
        onPress={() =>
          navigation.navigate("TagSearch", { yourCollectionName: "test" })
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
