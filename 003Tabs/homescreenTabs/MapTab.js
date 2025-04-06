import React from 'react';
import { View, Text } from 'react-native';
import { tabStyles } from '../../002Styles/homescreenstyles';

const MapTab = ({ navigation }) => {
  return (
    <View style={[tabStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
      <Text style={{ fontSize: 16 }}>地図の内容</Text>
    </View>
  );
};

export default MapTab;
