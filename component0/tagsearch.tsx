import React, { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Button,
  FlatList,
  Alert,
  Text,
} from "react-native";
import { Checkbox } from "expo-checkbox"; // expo-checkboxをインポート
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { collection, query, getDocs } from "firebase/firestore";
import { firestore } from "../lib/firebase"; // Firebase設定ファイルからfirestoreをインポート

// Firestoreから取得するデータの型を定義
interface DocumentData {
  id: string;
  tag?: Record<string, boolean>; // 動的なタグの型
}

interface TagSearchProps {
  yourCollectionName: string;
  tags?: string[]; // タグのリストを外部から受け取る（オプショナル）
}

const TagSearch: React.FC<TagSearchProps> = ({
  yourCollectionName,
  tags = [],
}) => {
  const [results, setResults] = useState<DocumentData[]>([]);
  const [selectedTags, setSelectedTags] = useState<Record<string, boolean>>(
    tags.reduce((acc, tag) => {
      acc[tag] = false; // 各タグを初期化
      return acc;
    }, {} as Record<string, boolean>)
  );

  const handleTagChange = (tag: string) => {
    setSelectedTags((prevTags) => ({
      ...prevTags,
      [tag]: !prevTags[tag],
    }));
  };

  const handleSearch = async () => {
    try {
      const q = query(collection(firestore, yourCollectionName)); // コレクション名を指定
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as DocumentData[]; // 型を指定

      // 選択したタグとドキュメントのtagフィールドをチェック
      const filteredResults = data.filter((item) => {
        const tagsData = item.tag || {}; // tagフィールドが存在しない場合は空のオブジェクトとする

        return Object.entries(selectedTags).some(([tag, isChecked]) => {
          return isChecked && tagsData[tag] === true; // チェックされたタグがtrueのとき
        });
      });

      setResults(filteredResults);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ExpoStatusBar style="auto" />

      {/* タグ選択チェックボックス */}
      <View style={styles.checkboxContainer}>
        {Object.keys(selectedTags).map((tag) => (
          <View key={tag} style={styles.checkbox}>
            <Checkbox
              value={selectedTags[tag]}
              onValueChange={() => handleTagChange(tag)}
              color={selectedTags[tag] ? "#4630EB" : undefined} // チェック時の色
            />
            <Text>{tag}</Text>
          </View>
        ))}
      </View>

      <Button title="Search" onPress={handleSearch} />
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            {/* id以外のフィールドを表示 */}
            {Object.entries(item).map(([key, value]) => {
              if (key !== "id") {
                return (
                  <Text key={key}>
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
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
});

export default TagSearch;
