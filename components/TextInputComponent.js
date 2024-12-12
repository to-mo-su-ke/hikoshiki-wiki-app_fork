import React, { useState } from "react";
import { TextInput, Text, View } from "react-native";
import { styles } from "../styles/sytles";

const TextInputComponent = () => {
  const [text, setText] = useState("");

  return (
    <View style={styles.inputContainer}>
      <Text>文字を入力:</Text>
      <TextInput
        style={styles.textInput}
        placeholder="テキストを入力"
        value={text}
        onChangeText={setText}
      />
    </View>
  );
};

export default TextInputComponent;
