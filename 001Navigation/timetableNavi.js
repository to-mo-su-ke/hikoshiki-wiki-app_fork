import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TimeTable from "../007Pages/timetableCreatePages/TimeTable";
import ClassSelection from "../007Pages/timetableCreatePages/ClassSelection";
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
