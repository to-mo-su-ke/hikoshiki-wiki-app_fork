import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import InputScreen from '../007Pages/homeScreenPages/InputScreen';


const Stack = createStackNavigator();

const Inputnavi = () => {
  return (
    <Stack.Navigator initialRouteName="Input">
        <Stack.Screen name="Input" component={InputScreen} />
        

     
    </Stack.Navigator>
  );
};

export default Inputnavi;