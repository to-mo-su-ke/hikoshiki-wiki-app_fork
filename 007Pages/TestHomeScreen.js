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
       title = "InputNewClub"
       onPress = {() => navigation.navigate('ClubSearchSubmit')}
      />
      <Button
        title="Notification"
        onPress={() => navigation.navigate('NotificationPage')}
      />

      <Button 
        title = "ClubRecruitmentConfirm"
        onPress = {() => navigation.navigate('ClubRecruitmentConfirm')}
      />
      <Button
        title="EventRegist"
        onPress={() => navigation.navigate('EventRegist')}

        
      />
      <Button 
      　title = "SearchEvent"
       onPress = {() => navigation.navigate('EventSearch')}
      />
      


    </View>
  );
};

export default TestHomeScreen;