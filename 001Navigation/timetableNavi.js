import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
// 修正：インポートパスを正しいディレクトリに更新
import TimeTable from "../007Pages/01homeScreenPages/timetableCreatePages/TimeTable";
import ClassSelection from "../007Pages/01homeScreenPages/timetableCreatePages/ClassSelection";
import CourseDetail from "../007Pages/01homeScreenPages/01home/CourseDetail";

const Stack = createStackNavigator();

const TimetableNavi = () => {
  return (
    <Stack.Navigator initialRouteName="TimeTable" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TimeTable" component={TimeTable} />
      <Stack.Screen name="ClassSelection" component={ClassSelection} />
      <Stack.Screen name="CourseDetail" component={CourseDetail} />
    </Stack.Navigator>
  );
};

export default TimetableNavi;
