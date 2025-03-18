import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Classsearch  from '../007Pages/homeScreenPages/002club/Clubsearch';
import Clubsearch from '../007Pages/homeScreenPages/002club/Clubsearch';
import clubmake from '../007Pages/homeScreenPages/002club/clubmake';
import EditAndResubmit from '../007Pages/homeScreenPages/002club/clubhen';
const Stack = createStackNavigator();

const Club = () => {
  return (
    <Stack.Navigator initialRouteName="Club">
        <Stack.Screen name="Edit" component={EditAndResubmit} />

        <Stack.Screen name="Clubsearch" component={Clubsearch} />
        <Stack.Screen name="Classsearch" component={Classsearch} />
        <Stack.Screen name="clubmake" component={clubmake} />
        

     
    </Stack.Navigator>
  );
};

export default Club;