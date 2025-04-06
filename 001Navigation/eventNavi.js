import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import EventSearch from "../007Pages/01homeScreenPages/02-2clubEvevnt/Search";
import EventRegist from "../007Pages/01homeScreenPages/02-2clubEvevnt/EventRegist";
import SearchDetail from "../007Pages/01homeScreenPages/02-2clubEvevnt/Searchdetail";
import ShinkanConfirm from "../007Pages/01homeScreenPages/02-2clubEvevnt/ShinkanConfirm";

const Stack = createStackNavigator();

const EventNavi = () => {
  return (
    <Stack.Navigator initialRouteName="EventSearch" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EventSearch" component={EventSearch} />
      <Stack.Screen name="EventRegist" component={EventRegist} />
      <Stack.Screen name="SearchDetail" component={SearchDetail} />
      <Stack.Screen name="ShinkanConfirm" component={ShinkanConfirm} />
    </Stack.Navigator>
  );
};

export default EventNavi;
