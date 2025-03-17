import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NotificationPage } from '../007Pages/notificationPages/notificationPage';
import { DMPage } from '../007Pages/notificationPages/DMPage';
import { DMDetailPage } from '../007Pages/notificationPages/DMDetailPage';


const Stack = createStackNavigator();

const NotificationNavi = () => {
  return (
      <Stack.Navigator initialRouteName="NotificationPage" screenOptions={{headerShown: false}}>
        <Stack.Screen name="NotificationPage" component={NotificationPage} />
        <Stack.Screen name="DMPage" component={DMPage} />
        <Stack.Screen name="DMDetailPage" component={DMDetailPage} />
      </Stack.Navigator>
  );
};

export default NotificationNavi;