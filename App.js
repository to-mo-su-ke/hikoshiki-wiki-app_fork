import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoadingScreen from "./007Pages/homeScreenPages/LoadingScreen";
import TestHomeScreen from "./007Pages/TestHomeScreen";
import HomeScreenNavigator from "./001Navigation/homeScreenNavi";
import MessageScreenNavigator from "./001Navigation/messageScreenNavi";
import LoginScreenNavigator from "./001Navigation/logInScreenNavi";
import Class from "./001Navigation/classclub";
import Club from "./001Navigation/clubnavi";
import Inputnavi from "./001Navigation/inputnavi";
import TimeTable from "./007Pages/timetableCreatePages/TimeTable";
import CourseDetail from "./007Pages/timetableCreatePages/CourseDetail";
import ClassSelection from "./007Pages/timetableCreatePages/ClassSelection";
import Clubdetail from "./007Pages/homeScreenPages/Clubdetail";
import UserInfo from "./007Pages/userhome/Userinfo";
import { Provider } from "react-redux";
import store from "./010Redux/store";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, StatusBar } from "react-native";
import ClubSearchSubmit from "./007Pages/homeScreenPages/clubmake";
import Gradenavi from "./001Navigation/gradenavi";


const Stack = createStackNavigator();

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApp = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 2秒待つ
      setLoading(false);
    };

    loadApp();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar />
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="TestHome">
            <Stack.Screen name="TestHome" component={TestHomeScreen} />
            <Stack.Screen
              name="HomeNavigator"
              component={HomeScreenNavigator}
            />
            <Stack.Screen
              name="MessageNavigator"
              component={MessageScreenNavigator}
            />
            <Stack.Screen
              name="LoginNavigator"
              component={LoginScreenNavigator}
            />
            <Stack.Screen name="Class" component={Class} />
            <Stack.Screen name="Club" component={Club} />
            <Stack.Screen name="TimeTable" component={TimeTable} />
            <Stack.Screen name="ClassSelection" component={ClassSelection} />
            <Stack.Screen name="CourseDetail" component={CourseDetail} />
            <Stack.Screen name="Clubdetail" component={Clubdetail} />
            <Stack.Screen name="UserInfo" component={UserInfo} />

            <Stack.Screen name="ClubSearchSubmit" component={ClubSearchSubmit} />
            <Stack.Screen name="Input" component={Inputnavi} />
            <Stack.Screen name="Grade" component={Gradenavi} />
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