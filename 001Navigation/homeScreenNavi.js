import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../007Pages/homeScreenPages/HomeScreen';
import InputScreen from '../007Pages/homeScreenPages/InputScreen';
import NewScreen from '../007Pages/homeScreenPages/Newscreen';
import ClubSearch from '../007Pages/homeScreenPages/Clubsearch';
import Clubdetail from '../007Pages/homeScreenPages/Clubdetail';
import Classsearch from '../007Pages/homeScreenPages/Classsearch';
const Stack = createStackNavigator();

const HomeScreenNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Input" component={InputScreen} />
      <Stack.Screen name="ClubSearch" component={ClubSearch} />
      <Stack.Screen name="Clubdetail" component={Clubdetail} />
      <Stack.Screen name="New" component={NewScreen} />
      <Stack.Screen name="Classsearch" component={Classsearch} />
    </Stack.Navigator>
  );
};

export default HomeScreenNavigator;