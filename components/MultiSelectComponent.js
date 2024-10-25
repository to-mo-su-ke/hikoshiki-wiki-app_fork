import React, { useState } from "react";
import { View, Text, CheckBox, Button } from "react-native";
import { styles } from "../styles/styles";

const MultiSelectComponent = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const toggleOption = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  return (
    <View style={styles.inputContainer}>
      <Text>オプションを選択:</Text>
      <CheckBox
        value={selectedOptions.includes("option1")}
        onValueChange={() => toggleOption("option1")}
      />
      <Text>オプション1</Text>

      <CheckBox
        value={selectedOptions.includes("option2")}
        onValueChange={() => toggleOption("option2")}
      />
      <Text>オプション2</Text>

      <Button
        title="確認"
        onPress={() => console.log("Selected Options:", selectedOptions)}
      />
    </View>
  );
};

export default MultiSelectComponent;
