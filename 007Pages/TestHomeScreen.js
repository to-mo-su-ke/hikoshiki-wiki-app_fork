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
        title="TimeTable"
        onPress={() => navigation.navigate("TimeTable")}
      />
      <Button
        title="Class"
        onPress={() => navigation.navigate("Class")} 
      />
       <Button
        title="club"
        onPress={() => navigation.navigate("Club")} 
      />
        <Button
          title="clubmake"
          onPress={() => navigation.navigate("ClubSearchSubmit")}
        />
        <Button 
        title="Input"
        onPress ={() => navigation.navigate("Input")}
        />         
        <Button
        title="Grade"
        onPress={() => navigation.navigate("Grade")}

        />
        
      

    </View>
  );
};

export default TestHomeScreen;