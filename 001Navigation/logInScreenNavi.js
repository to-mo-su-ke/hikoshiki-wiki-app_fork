import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';

import LoginOrSignupScreen from '../007Pages/loginPages/loginOrSignup';
import SignUpScreen from '../007Pages/loginPages/signup';
import InputPersonalInformationScreen1 from '../007Pages/loginPages/signUp1';
import InputPersonalInformationScreen2 from '../007Pages/loginPages/signUp2';
import SelectClubScreen from '../007Pages/loginPages/selectClub';
import ConfirmScreen from '../007Pages/loginPages/confirmScreen';
import EmailResendScreen from '../007Pages/loginPages/emailResend';
import LoadingScreen from '../007Pages/loginPages/loading';
import HomeScreenNavigator from './homeScreenNavi';

// 実験用
import { useEffect, useState } from 'react';
import { auth } from "../004BackendModules/messageMetod/firebase";
import { onAuthStateChanged } from 'firebase/auth';
const Stack = createStackNavigator();

const LoginScreenNavigator = () => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     // リスナーを登録して、認証状態の変化を監視
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         console.log('サインインしています:', user);
//         setUser(user);
//       } else {
//         console.log('サインアウトしています');
//         setUser(null);
//       }
//     });

//     // コンポーネントのアンマウント時にリスナーを解除してメモリリークを防止する
//     return () => unsubscribe();
//   }, []);

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