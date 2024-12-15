import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../007Pages/homeScreenPages/HomeScreen';
import InputScreen from '../007Pages/homeScreenPages/InputScreen';

const Stack = createStackNavigator();

const HomeScreenNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Input" component={InputScreen} />
    </Stack.Navigator>
  );
};

export default HomeScreenNavigator;