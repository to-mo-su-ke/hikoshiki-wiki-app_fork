import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { DummyScreen, DummyCheckScreen, SubjectDetailScreen } from '../007Pages/messagePages/subjectDetail2';
import { DummyFormScreen, PrvisionalFormScreen} from '../007Pages/messagePages/ProvisionalForm';

const Stack = createStackNavigator();

const SubjectDetailNavicator = () => {
  return (
    <Stack.Navigator initialRouteName="wrapper" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="wrapper" component={DummyScreen} />
          <Stack.Screen name="DummyCheckScreen" component={DummyCheckScreen} />
          <Stack.Screen name="DummyFormScreen" component={DummyFormScreen} />
          <Stack.Screen name="SubjectDetailScreen" component={SubjectDetailScreen} />
          <Stack.Screen name="PrvisionalFormScreen" component={PrvisionalFormScreen} />
    </Stack.Navigator>
  );
};

export default SubjectDetailNavicator;