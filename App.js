// ===== ライブラリ関連のインポート =====
import React, { useState, useEffect } from "react";
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

// ===== ページファイル関連のインポート =====
import ClubInfo from './007Pages/01homeScreenPages/06userhome/Cubinfo';
import ClubMakeEdit from './007Pages/01homeScreenPages/02-1club/clubmake_edit';
import TimeTable from "./007Pages/01homeScreenPages/timetableCreatePages/TimeTable";
import CourseDetail from "./007Pages/01homeScreenPages/01home/CourseDetail";
import ClassSelection from "./007Pages/01homeScreenPages/timetableCreatePages/ClassSelection";
import Clubdetail from "./007Pages/01homeScreenPages/02-1club/Clubdetail";
import UserInfo from "./007Pages/01homeScreenPages/06userhome/Userinfo";
import Userinfoedit from "./007Pages/01homeScreenPages/06userhome/Userinfoedit";
import CourseDetailView from "./007Pages/01homeScreenPages/timetableCreatePages/CourseDetailView"
import ShinkanConfirmforuser from "./007Pages/01homeScreenPages/06userhome/Shinkanconfirmforuser";
import { Notification } from "./007Pages/0Anotification/notificationService";
import { DMListPage, DMDetailPage } from "./007Pages/0Anotification/DMpages";
import ShinkanConfirm from "./007Pages/01homeScreenPages/02-2clubEvevnt/ShinkanConfirm";
import { NotificationPage } from "./007Pages/0Anotification/notificationPages";
import ClubSearchSubmit from "./007Pages/01homeScreenPages/02-1club/clubmake";
import ClassReviewAdd from "./007Pages/01homeScreenPages/06userhome/Class/Classrreviewadd";
import ClubConfirmSubmit from "./007Pages/01homeScreenPages/02-1club/clubmake2";
import EventSearch from "./007Pages/01homeScreenPages/02-2clubEvevnt/Search";
import GradeInfo from "./007Pages/01homeScreenPages/06userhome/gradeinfo";
import EventRegist from "./007Pages/01homeScreenPages/02-2clubEvevnt/EventRegist";
import SearchDetail from "./007Pages/01homeScreenPages/02-2clubEvevnt/Searchdetail";
import Administnotification from "./007Pages/0Anotification/Administnotification";
import ColumAdminist from "./007Pages/01homeScreenPages/06userhome/ColumAdminist";
import FreemarketInput from "./007Pages/01homeScreenPages/06userhome/FreemarketInput";

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
            
            {/* 直接ページへのナビゲーション */}
            <Stack.Screen name="TimeTable" component={TimeTable} />
            <Stack.Screen name="ClassSelection" component={ClassSelection} />
            <Stack.Screen name="CourseDetail" component={CourseDetail} />
            <Stack.Screen name="UserInfo" component={UserInfo} />
            <Stack.Screen name="Userinfoedit" component={Userinfoedit} />
            <Stack.Screen name="GradeInfo" component={GradeInfo} />
            <Stack.Screen name="ClubInfo" component={ClubInfo} />
            <Stack.Screen name="ClassReviewAdd" component={ClassReviewAdd} />
            <Stack.Screen name="ShinkanConfirmforuser" component={ShinkanConfirmforuser} />
            <Stack.Screen name="NotificationPage" component={NotificationPage} />
            <Stack.Screen name="DMListPage" component={DMListPage} />
            <Stack.Screen name="DMDetailPage" component={DMDetailPage} />
            <Stack.Screen name="Clubdetail" component={Clubdetail} />
            <Stack.Screen name="ClubMakeEdit" component={ClubMakeEdit} />
            <Stack.Screen name="ClubSearchSubmit" component={ClubSearchSubmit} />
            <Stack.Screen name="ClubConfirmSubmit" component={ClubConfirmSubmit} />
            <Stack.Screen name="EventSearch" component={EventSearch} />
            <Stack.Screen name="EventRegist" component={EventRegist} />
            <Stack.Screen name="SearchDetail" component={SearchDetail} />
            <Stack.Screen name="ShinkanConfirm" component={ShinkanConfirm} />
            <Stack.Screen name="CourseDetailView" component={CourseDetailView} />
            <Stack.Screen name="Administnotification" component={Administnotification} />
            <Stack.Screen name="ColumAdminist" component={ColumAdminist} />

            <Stack.Screen name="FreemarketInput" component={FreemarketInput} />
            
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