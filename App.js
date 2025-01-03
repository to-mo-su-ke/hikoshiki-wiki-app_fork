import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoadingScreen from './007Pages/homeScreenPages/LoadingScreen';
import TestHomeScreen from './007Pages/TestHomeScreen';
import HomeScreenNavigator from './001Navigation/homeScreenNavi';
import MessageScreenNavigator from './001Navigation/messageScreenNavi';
import LoginScreenNavigator from './001Navigation/logInScreenNavi';
import SubjectDetailNavicator from './001Navigation/subjectDetailNavi';
const Stack = createStackNavigator();

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApp = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 2秒待つ
      setLoading(false);
    };

    loadApp();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="TestHome">
        <Stack.Screen name="TestHome" component={TestHomeScreen} />
        <Stack.Screen name="HomeNavigator" component={HomeScreenNavigator} />
        <Stack.Screen name="MessageNavigator" component={MessageScreenNavigator} />
        <Stack.Screen name="LoginNavigator" component={LoginScreenNavigator} />
        <Stack.Screen name="SubjectDetailNavicator" component={SubjectDetailNavicator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;