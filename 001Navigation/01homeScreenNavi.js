import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../007Pages/01homeScreenPages/HomeScreen';

const Stack = createStackNavigator();

const HomeScreenNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
};

export default HomeScreenNavigator;