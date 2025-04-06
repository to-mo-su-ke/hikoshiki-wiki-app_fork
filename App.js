// ===== ライブラリ関連のインポート =====
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider } from "react-redux";
import store from "./010Redux/store";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, StatusBar } from "react-native";

// ===== ナビゲーター関連のインポート =====
import LoginScreenNavigator from "./001Navigation/00logInScreenNavi";
import HomeScreenNavigator from "./001Navigation/01homeScreenNavi";
import MessageScreenNavigator from "./001Navigation/messageScreenNavi";
import Club from "./001Navigation/clubnavi";
import NotificationNavi from "./001Navigation/notificationnavi";
import Gradenavi from "./001Navigation/gradenavi";
import TimetableNavi from "./001Navigation/timetableNavi";
import UserProfileNavi from "./001Navigation/userProfileNavi";
import EventNavi from "./001Navigation/eventNavi";

const Stack = createStackNavigator();

const App = () => {
  return (
    <SafeAreaView style={styles.root}>
      <StatusBar />
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="LoginNavigator">
            <Stack.Screen
              name="LoginNavigator"
              component={LoginScreenNavigator}
            />
            <Stack.Screen
              name="HomeNavigator"
              component={HomeScreenNavigator}
            />
            <Stack.Screen
              name="MessageNavigator"
              component={MessageScreenNavigator}
            />
            <Stack.Screen name="Club" component={Club} />
            <Stack.Screen name="NotificationNavi" component={NotificationNavi} />
            <Stack.Screen name="Grade" component={Gradenavi} />
            <Stack.Screen name="TimetableNavi" component={TimetableNavi} />
            <Stack.Screen name="UserProfileNavi" component={UserProfileNavi} />
            <Stack.Screen name="EventNavi" component={EventNavi} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});