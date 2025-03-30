import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NotificationPage } from '../007Pages/notification/notificationPages';
import { DMListPage } from '../007Pages/notification/DMpages';
import { DMDetailPage } from '../007Pages/notification/DMpages';

const Stack = createStackNavigator();

const NotificationNavi = () => {
  return (
      <Stack.Navigator initialRouteName="NotificationPage" screenOptions={{headerShown: false}}>
        <Stack.Screen name="NotificationPage" component={NotificationPage} />
        <Stack.Screen name="DMListPage" component={DMListPage} />
        <Stack.Screen name="DMDetailPage" component={DMDetailPage} />
      </Stack.Navigator>
  );
};

export default NotificationNavi;