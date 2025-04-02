import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../007Pages/homeScreenPages/HomeScreen';
import InputScreen from '../007Pages/homeScreenPages/InputScreen';
import NewScreen from '../007Pages/homeScreenPages/Newscreen';
import ChangePasswordScreen from '../007Pages/userhome/ChangePasswordScreen';

const Stack = createStackNavigator();

const HomeScreenNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Input" component={InputScreen} />
      <Stack.Screen name="New" component={NewScreen} />
      <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
    </Stack.Navigator>
  );
};

export default HomeScreenNavigator;