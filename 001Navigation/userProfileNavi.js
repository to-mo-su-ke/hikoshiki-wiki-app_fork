import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import UserInfo from "../007Pages/01homeScreenPages/06userhome/Userinfo";
import Userinfoedit from "../007Pages/01homeScreenPages/06userhome/Userinfoedit";
import GradeInfo from "../007Pages/01homeScreenPages/06userhome/gradeinfo";
import ClubInfo from '../007Pages/01homeScreenPages/06userhome/Cubinfo';
import ClassReviewAdd from "../007Pages/01homeScreenPages/06userhome/Class/Classrreviewadd";
import ShinkanConfirmforuser from "../007Pages/01homeScreenPages/06userhome/Shinkanconfirmforuser";

const Stack = createStackNavigator();

const UserProfileNavi = () => {
  return (
    <Stack.Navigator initialRouteName="UserInfo" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserInfo" component={UserInfo} />
      <Stack.Screen name="Userinfoedit" component={Userinfoedit} />
      <Stack.Screen name="GradeInfo" component={GradeInfo} />
      <Stack.Screen name="ClubInfo" component={ClubInfo} />
      <Stack.Screen name="ClassReviewAdd" component={ClassReviewAdd} />
      <Stack.Screen name="ShinkanConfirmforuser" component={ShinkanConfirmforuser} />
    </Stack.Navigator>
  );
};

export default UserProfileNavi;
