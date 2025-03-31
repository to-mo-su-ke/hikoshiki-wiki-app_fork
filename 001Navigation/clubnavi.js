import React from 'react';
import { createStackNavigator } from '@react-navigation/stack'; // Stack Navigatorを使用
import { StyleSheet, ScrollView } from 'react-native';
import Classsearch from '../007Pages/homeScreenPages/002club/Clubsearch';
import Clubsearch from '../007Pages/homeScreenPages/002club/Clubsearch';
import clubmake from '../007Pages/homeScreenPages/002club/clubmake';
import EditAndResubmit from '../007Pages/homeScreenPages/002club/clubhen';
import ShinkanTab from '../007Pages/clubEvevntPages/ShinkanTab'; // 新歓タブコンポーネントをインポート

const Stack = createStackNavigator();

const Club = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#f8f9fa' }
      }}
    >
      <Stack.Screen name="EditTab" component={EditAndResubmit} options={{ title: '編集' }} />
      <Stack.Screen name="ClubsearchTab" component={Clubsearch} options={{ title: '部活検索' }} />
      <Stack.Screen name="ClasssearchTab" component={Classsearch} options={{ title: 'クラス検索' }} />
      <Stack.Screen name="clubmakeTab" component={clubmake} options={{ title: '部活作成' }} />
      
      {/* 新歓タブを追加 */}
      <Stack.Screen 
        name="ShinkanTab" 
        component={ShinkanTab} 
        options={{ title: '新歓' }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
});

export default Club;