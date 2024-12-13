//サインアップ画面のルーティングです

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignUpScreen from '../pages/signupOrLogin';
import InputPersonalInformationScreen1 from '../pages/signUp1';
import InputPersonalInformationScreen2 from '../pages/signUp2';
import SelectClubScreen from '../pages/selectClub';
import ConfirmScreen from '../pages/confirmScreen';
import EmailResendScreen from '../pages/emailResend';

const Stack = createStackNavigator();

function Index() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignUpScreen">
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        <Stack.Screen name="InputPersonalInformationScreen1" component={InputPersonalInformationScreen1} />
        <Stack.Screen name="InputPersonalInformationScreen2" component={InputPersonalInformationScreen2} />
        <Stack.Screen name="SelectClubScreen" component={SelectClubScreen} />
        <Stack.Screen name="ConfirmScreen" component={ConfirmScreen} />
        <Stack.Screen name="EmailResendScreen" component={EmailResendScreen} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Index;
