import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import AppNavigator from "./component/messagerouting"; // AppNavigatorのパスを確認
import LoginWithEmail from "./login";
import { ChatRoomSelection } from "./component/ChatRoomSelection";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ChatAdmin } from "./component/chatAdmin";
import { Chatclub } from "./component/chatClub";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ChatRoomSelection">
        <Stack.Screen name="ChatRoomSelction" component={ChatRoomSelection}/>
        <Stack.Screen name="ChatAdmin" component={ChatAdmin}/>
        <Stack.Screen name="Chatclub" component={Chatclub}/>
      </Stack.Navigator>
    </NavigationContainer>
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
