import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SubjectBulletinScreen, DummyScreen } from '../007Pages/messagePages/bulletin';

const Stack = createStackNavigator();

const MessageScreenNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="DummyScreen">
      <Stack.Screen name="DummyScreen" component={DummyScreen} />
      <Stack.Screen name="SubjectBulletinScreen" component={SubjectBulletinScreen} />
    </Stack.Navigator>
  );
};

export default MessageScreenNavigator;