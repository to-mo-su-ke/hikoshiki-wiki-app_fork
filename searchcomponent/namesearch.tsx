import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  SafeAreaView,
  View,
  Button,
  FlatList,
  Alert,
  Text,
} from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { Timestamp, collection, query, getDocs } from "firebase/firestore";
import { firestore } from "../lib/firebase"; // Firebase設定ファイルからfirestoreをインポート

const SearchScreen = ({ yourCollectionName, yourFieldName }) => {
  const [queryText, setQueryText] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const q = query(
        collection(firestore, yourCollectionName) // コレクション名を指定
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => {
        const docData = doc.data();
        const name = docData[yourFieldName]; // フィールド名を使用してnameを取得
        return { id: doc.id, ...docData, name };
      });

      // 部分一致・完全一致のチェック
      const filteredResults = data.filter(
        (item) => item.name.includes(queryText) // 部分一致でフィルタリング
      );

      setResults(filteredResults);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ExpoStatusBar style="auto" />
      <TextInput
        style={styles.input}
        placeholder="Search..."
        value={queryText}
        onChangeText={setQueryText}
      />
      <Button title="Search" onPress={handleSearch} />
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            {/* idとname以外のフィールドを表示 */}
            {Object.entries(item).map(([key, value]) => {
              if (key !== "id") {
                // idとnameを除外
                return (
                  <Text key={key}>
                    {key}:{""}
                    {typeof value === "object"
                      ? JSON.stringify(value)
                      : String(value)}
                  </Text>
                );
              }
              return null;
            })}
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
});

export default SearchScreen;
