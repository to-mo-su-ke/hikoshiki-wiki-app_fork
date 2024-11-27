import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./pages/HomeScreen";
import Calendar from "./pages/Calender";
import DayEvents from "./pages/DayEvents"; // DayEventsコンポーネントをインポート

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        {/* <Stack.Screen name="PhotoUpload" component={PhotoUploadPage} />
        <Stack.Screen name="InformationForm" component={InformationForm} /> */}
        <Stack.Screen name="Calendar" component={Calendar} />
        <Stack.Screen name="DayEvents" component={DayEvents} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
