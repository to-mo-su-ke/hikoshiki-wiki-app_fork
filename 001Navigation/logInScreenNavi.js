import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

//import SignUpScreen from '../007Pages/loginPages/signUp';
import InputPersonalInformationScreen1 from '../007Pages/loginPages/signUp1';
import InputPersonalInformationScreen2 from '../007Pages/loginPages/signUp2';
import SelectClubScreen from '../007Pages/loginPages/selectClub';
import ConfirmScreen from '../007Pages/loginPages/confirmScreen';
import EmailResendScreen from '../007Pages/loginPages/emailResend';

const Stack = createStackNavigator();

const LoginScreenNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="SignUpScreen">
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        <Stack.Screen name="InputPersonalInformationScreen1" component={InputPersonalInformationScreen1} />
        <Stack.Screen name="InputPersonalInformationScreen2" component={InputPersonalInformationScreen2} />
        <Stack.Screen name="SelectClubScreen" component={SelectClubScreen} />
        <Stack.Screen name="ConfirmScreen" component={ConfirmScreen} />
        <Stack.Screen name="EmailResendScreen" component={EmailResendScreen} />

    </Stack.Navigator>
  );
};

export default LoginScreenNavigator;