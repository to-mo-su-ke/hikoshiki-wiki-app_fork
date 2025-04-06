import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import Classsearch from '../007Pages/01homeScreenPages/02-1club/Clubsearch';
import Clubsearch from '../007Pages/01homeScreenPages/02-1club/Clubsearch';
import clubmake from '../007Pages/01homeScreenPages/02-1club/clubmake';
import ClubConfirmSubmit from '../007Pages/01homeScreenPages/02-1club/clubmake2';
import ClubMakeEdit from '../007Pages/01homeScreenPages/02-1club/clubmake_edit';
import Clubdetail from '../007Pages/01homeScreenPages/02-1club/Clubdetail';
import EditAndResubmit from '../007Pages/01homeScreenPages/02-1club/clubhen';
import ShinkanTab from '../007Pages/clubEvevntPages/ShinkanTab';

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
      <Stack.Screen name="clubmake2" component={ClubConfirmSubmit} options={{ title: '部活確認' }} />
      <Stack.Screen name="ClubMakeEdit" component={ClubMakeEdit} options={{ title: '部活編集' }} />
      <Stack.Screen name="Clubdetail" component={Clubdetail} options={{ title: '部活詳細' }} />
      
      {/* 新歓タブを追加 */}
      <Stack.Screen 
        name="ShinkanTab" 
        component={ShinkanTab} 
        options={{ title: '新歓' }}
      />
    </Stack.Navigator>
  );
};

export default Club;