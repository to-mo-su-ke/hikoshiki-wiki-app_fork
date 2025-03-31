import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoadingScreen from "./007Pages/homeScreenPages/LoadingScreen";
import TestHomeScreen from "./007Pages/TestHomeScreen";
import HomeScreenNavigator from "./001Navigation/homeScreenNavi";
import MessageScreenNavigator from "./001Navigation/messageScreenNavi";
import LoginScreenNavigator from "./001Navigation/logInScreenNavi";
import ClubInfo from './007Pages/userhome/Cubinfo';
import ClubMakeEdit from './007Pages/homeScreenPages/002club/clubmake_edit';
import Club from "./001Navigation/clubnavi";
import Inputnavi from "./001Navigation/inputnavi";
import TimeTable from "./007Pages/timetableCreatePages/TimeTable";
import CourseDetail from "./007Pages/timetableCreatePages/CourseDetail";
import ClassSelection from "./007Pages/timetableCreatePages/ClassSelection";
import Clubdetail from "./007Pages/homeScreenPages/002club/Clubdetail";
import UserInfo from "./007Pages/userhome/Userinfo";
import Userinfoedit from "./007Pages/userhome/Userinfoedit";
import ShinkanConfirmforuser from "./007Pages/userhome/Shinkanconfirmforuser";
import NotificationNavi from "./001Navigation/notificationnavi";
import { Notification } from "./007Pages/notification/notificationService";

import { DMListPage } from "./007Pages/notification/DMpages";
import { DMDetailPage } from "./007Pages/notification/DMpages";
import ShinkanConfirm from "./007Pages/clubEvevntPages/ShinkanConfirm";
import { Provider } from "react-redux";
import store from "./010Redux/store";
import { NotificationPage } from "./007Pages/notification/notificationPages";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, StatusBar } from "react-native";
import ClubSearchSubmit from "./007Pages/homeScreenPages/002club/clubmake";
import Gradenavi from "./001Navigation/gradenavi";
import ClassReviewAdd from "./007Pages/homeScreenPages/Class/Classrreviewadd";
import ClubConfirmSubmit from "./007Pages/homeScreenPages/002club/clubmake2";
import EventSearch from "./007Pages/clubEvevntPages/Search";
import GradeInfo from "./007Pages/userhome/gradeinfo";
import EventRegist from "./007Pages/clubEvevntPages/EventRegist";
import SearchDetail from "./007Pages/clubEvevntPages/Searchdetail";
const Stack = createStackNavigator();

const App = () => {
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const loadApp = async () => {
  //     await new Promise((resolve) => setTimeout(resolve, 2000)); // 2秒待つ
  //     setLoading(false);
  //   };

  //   loadApp();
  // }, []);

  // if (loading) {
  //   return <LoadingScreen />;
  // }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar />
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="LoginNavigator">
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
          
            <Stack.Screen name="Club" component={Club} />
            
            <Stack.Screen name="TimeTable" component={TimeTable} />
            <Stack.Screen name="ClassSelection" component={ClassSelection} />
            <Stack.Screen name="CourseDetail" component={CourseDetail} />
            <Stack.Screen name="Clubdetail" component={Clubdetail} />
            <Stack.Screen name="UserInfo" component={UserInfo} />
            <Stack.Screen name="ClassReviewAdd" component={ClassReviewAdd} />

          
            <Stack.Screen name="ShinkanConfirm" component={ShinkanConfirm} />
            <Stack.Screen name="ShinkanConfirmforuser" component={ShinkanConfirmforuser} />
            
            <Stack.Screen name="NotificationNavi" component={NotificationNavi} />
            <Stack.Screen name="NotificationPage" component={NotificationPage} />
            <Stack.Screen name="DMListPage" component={DMListPage} />


            <Stack.Screen name="ClubInfo" component={ClubInfo}  />
            <Stack.Screen name="ClubMakeEdit" component={ClubMakeEdit} />
            <Stack.Screen name="GradeInfo" component={GradeInfo} /> 
            <Stack.Screen name="ClubSearchSubmit" component={ClubSearchSubmit} />
            <Stack.Screen name="Input" component={Inputnavi} />
            <Stack.Screen name="Grade" component={Gradenavi} />
            <Stack.Screen name="clubmake2" component={ClubConfirmSubmit} />
            <Stack.Screen name="Userinfoedit" component={Userinfoedit} />
            <Stack.Screen name="EventRegist" component={EventRegist} />
            <Stack.Screen name="EventSearch" component={EventSearch} />
            <Stack.Screen name="SearchDetail" component={SearchDetail} />
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