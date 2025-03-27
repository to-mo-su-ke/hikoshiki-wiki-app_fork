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
import { firestore } from "../../004BackendModules/messageMetod/firebase";

  

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
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1e3a8a",
    textAlign: "center",
  },
  sectionContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  input: {
    height: 50,
    borderColor: "#e2e8f0",
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  buttonContainer: {
    backgroundColor: "#1e3a8a",
    borderRadius: 12,
    padding: 12,
    marginVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  resultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  selectedItem: {
    color: "#1e3a8a",
    fontWeight: "600",
  },
  normalItem: {
    color: "#475569",
  },
});

