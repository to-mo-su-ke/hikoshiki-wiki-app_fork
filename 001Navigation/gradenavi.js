import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Gradecheck from '../007Pages/01homeScreenPages/06userhome/gradecheck';


const Stack = createStackNavigator();

const Gradenavi = () => {
  return (
    <Stack.Navigator initialRouteName="Grade">
        <Stack.Screen name="Grade" component={Gradecheck} />
        

     
    </Stack.Navigator>
  );
};

export default Gradenavi;