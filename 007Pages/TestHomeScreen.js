import React from 'react';
import { View, Text, Button } from 'react-native';

const TestHomeScreen = ({ navigation }) => {
  return (
    <View>
      <Text>Test Home Screen</Text>
      <Button
        title="Home Navigator"
        onPress={() => navigation.navigate('HomeNavigator')}
      />
      <Button
        title="Message Navigator"
        onPress={() => navigation.navigate('MessageNavigator')}
      />
      <Button
        title="Login Navigator"
        onPress={() => navigation.navigate('LoginNavigator')}
      />
      <Button
        title="Clubdetail"
        onPress={() => navigation.navigate('Clubdetail')}
      />
      <Button
       title = "InputNewClub"
       onPress = {() => navigation.navigate('InputNewClub')}
      />

      <Button 
        title = "ClubRecruitmentConfirm"
        onPress = {() => navigation.navigate('ClubRecruitmentConfirm')}
      />
                

    </View>
  );
};

export default TestHomeScreen;