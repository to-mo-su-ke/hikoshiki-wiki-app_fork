import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Classsearch  from '../007Pages/homeScreenPages/Classsearch';
import Clubsearch from '../007Pages/homeScreenPages/Clubsearch';


const Stack = createStackNavigator();

const Class = () => {
  return (
    <Stack.Navigator initialRouteName="ClassClub">
        <Stack.Screen name="Classsearch" component={Classsearch} />
        

     
    </Stack.Navigator>
  );
};

export default Class;