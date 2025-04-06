import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';

import LoginOrSignupScreen from '../007Pages/00loginPages/loginOrSignup';
import SignUpScreen from '../007Pages/00loginPages/signup';
import InputPersonalInformationScreen1 from '../007Pages/00loginPages/signUp1';
import InputPersonalInformationScreen2 from '../007Pages/00loginPages/signUp2';
import SelectClubScreen from '../007Pages/00loginPages/selectClub';
import ConfirmScreen from '../007Pages/00loginPages/confirmScreen';
import EmailResendScreen from '../007Pages/00loginPages/emailResend';
import LoadingScreen from '../007Pages/00loginPages/loading';

const Stack = createStackNavigator();

const LoginScreenNavigator = () => {
  return (
    <PaperProvider>
      <Stack.Navigator initialRouteName="LoadingScreen" screenOptions={{headerShown: false}}>
          <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
          <Stack.Screen name="LoginOrSignUpScreen" component={LoginOrSignupScreen} />
          <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
          <Stack.Screen name="InputPersonalInformationScreen1" component={InputPersonalInformationScreen1} />
          <Stack.Screen name="InputPersonalInformationScreen2" component={InputPersonalInformationScreen2} />
          <Stack.Screen name="SelectClubScreen" component={SelectClubScreen} />
          <Stack.Screen name="ConfirmScreen" component={ConfirmScreen} />
          <Stack.Screen name="EmailResendScreen" component={EmailResendScreen} />
      </Stack.Navigator>
    </PaperProvider>
  );
};

export default LoginScreenNavigator;