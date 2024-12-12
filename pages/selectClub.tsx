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
import { firestore } from "../lib/firebase";

  

export default function SelectClubScreen({ navigation, route })  {
  const clubId = route.params.clubId;
  const onSelect = route.params.onSelect;
  console.log(clubId);

  // 各アイテムの型定義
  interface Item {
    id: string;
    name: any;
    [key: string]: any;
  }

  // Propsの型定義
  interface SearchScreenProps {
    yourCollectionName: string;
    yourFieldName: string;
  }

  const SearchScreen: React.FC<SearchScreenProps> = ({ yourCollectionName, yourFieldName }) => {
    const [queryText, setQueryText] = useState("");
    const [results, setResults] = useState<Item[]>([]); // 型を明示的に指定
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedName, setSelectedName] = useState<string | null>(null);  

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
        const errorMessage = (error as string);
        console.error(errorMessage);
      }
    };

    const handleSelect = (item: Item) => {
      setSelectedId(item.id);
      setSelectedName(item.name);
      Alert.alert("選択されたアイテム", `ID: ${item.id}\nName: ${item.name}`);
      onSelect(item.name);
      navigation.goBack();
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
              <Text
                onPress={() => handleSelect(item)}
                style={{ color: item.id === selectedId ? 'blue' : 'black' }}
              >
                {item.name}
              </Text>
            </View>
          )}
        />
      </SafeAreaView>
    );
  };

  return (
      <SafeAreaView style={styles.container}>
          <Text>部活動を選択してください</Text>
          <SearchScreen yourCollectionName="test2" yourFieldName="name" />
      </SafeAreaView>
  )
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

