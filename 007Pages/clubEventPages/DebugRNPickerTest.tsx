import React from 'react';
import { StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Ionicons from 'react-native-vector-icons/Ionicons';

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
    padding: 5,
    paddingRight: 20,
  },
  iconContainer: {
    top: 6,
    right: 25,
  },
});

const DebugRNPickerTest = () => {
  return (
    <RNPickerSelect
      onValueChange={(value) => console.log(value)}
      placeholder={{
        label: 'Select a club',
        value: null,
      }}
      items={[
        { label: 'Football', value: 'football' },
        { label: 'Baseball', value: 'baseball' },
        { label: 'Hockey', value: 'hockey' },
      ]}
      style={pickerSelectStyles}
      Icon={() => {
        return <Ionicons name="ios-arrow-down" size={24} color="gray" style={pickerSelectStyles.iconContainer} />;
      }}
    />
  );
};

export default DebugRNPickerTest;