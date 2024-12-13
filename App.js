import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoadingScreen from "./pages/LoadingScreen";
import HomeScreen from "./pages/HomeScreen";
import InputScreen from "./pages/InputScreen";
import NewScreen from "./pages/NewScreen";
import RNPtest from "./pages/RNPtest";


const Stack = createStackNavigator();

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApp = async () => {
      // ロード処理をここで行う
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setLoading(false);
    };

    loadApp();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Input" component={InputScreen} />
        <Stack.Screen name="送信モデル画面" component={NewScreen} />
        <Stack.Screen name="RNPtest" component={RNPtest} />
        </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
