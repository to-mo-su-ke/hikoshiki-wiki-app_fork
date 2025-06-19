import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../007Pages/01homeScreenPages/HomeScreen';
import UserProfileNavi from './userProfileNavi'; // Import the UserProfileNavi component

const Stack = createStackNavigator();

const HomeScreenNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileNavi} />
    </Stack.Navigator>
  );
};

export default HomeScreenNavigator;