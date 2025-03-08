import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NotificationPage } from '../007Pages/notificationPages/notificationPage';

const Stack = createStackNavigator();

const NotificationNavi = () => {
  return (
      <Stack.Navigator initialRouteName="NotificationPage" screenOptions={{headerShown: false}}>
        <Stack.Screen name="NotificationPage" component={NotificationPage} />
      </Stack.Navigator>
  );
};

export default NotificationNavi;