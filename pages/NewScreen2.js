import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from "react-native";
import { pickImage, handleFormSubmit } from "../backend/SendMethod";

const NewScreen = () => {
  const [clubName, setClubName] = useState("");
  const [selectedImages, setSelectedImages] = useState([null, null]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>部活の名前:</Text>
      <TextInput
        style={styles.input}
        placeholder="部活の名前を入力"
        value={clubName}
        onChangeText={setClubName}
      />
      <Text style={styles.label}>写真1:</Text>
      <TouchableOpacity onPress={() => pickImage(0, selectedImages, setSelectedImages)} style={styles.imagePicker}>
        {selectedImages[0] ? (
          <Image source={{ uri: selectedImages[0] }} style={styles.image} />
        ) : (
          <Text>写真を選択</Text>
        )}
      </TouchableOpacity>
      <Text style={styles.label}>写真2:</Text>
      <TouchableOpacity onPress={() => pickImage(1, selectedImages, setSelectedImages)} style={styles.imagePicker}>
        {selectedImages[1] ? (
          <Image source={{ uri: selectedImages[1] }} style={styles.image} />
        ) : (
          <Text>写真を選択</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleFormSubmit(clubName, selectedImages)} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>送信</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 20,
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    height: 200,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  submitButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default NewScreen;