import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignUpScreen from './signup';
import InputPersonalInformationScreen from './mailcheck';

const Stack = createStackNavigator();

function Index() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignUpScreen">
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        <Stack.Screen name="InputPersonalInformationScreen" component={InputPersonalInformationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Index;
