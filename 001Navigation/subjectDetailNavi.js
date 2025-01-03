import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { DummyScreen, SubjectDetailScreen } from '../007Pages/messagePages/subjectDetail';

const Stack = createStackNavigator();

const SubjectDetailNavicator = () => {
  return (
    <Stack.Navigator initialRouteName="wrapper">
          <Stack.Screen name="wrapper" component={DummyScreen} />
          <Stack.Screen name="SubjectDetailScreen" component={SubjectDetailScreen} />
    </Stack.Navigator>
  );
};

export default SubjectDetailNavicator;