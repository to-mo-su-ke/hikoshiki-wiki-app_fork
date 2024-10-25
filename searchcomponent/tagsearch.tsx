import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Button,
  FlatList,
  Alert,
  Text,
  TextInput,
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
  const [selectedTags, setSelectedTags] = useState<Record<string, boolean>>({});
  const [newTag, setNewTag] = useState<string>(""); // 新しいタグの入力を管理するためのstate

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(firestore, yourCollectionName)); // コレクション名を指定
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as DocumentData[]; // 型を指定

        // タグの初期設定
        const tagsData = data.reduce((acc, item) => {
          if (item.tag) {
            Object.keys(item.tag).forEach((tag) => {
              if (!acc[tag]) acc[tag] = false; // 未設定のタグを初期化
            });
          }
          return acc;
        }, {} as Record<string, boolean>);

        setSelectedTags(tagsData);
        setResults(data);
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    };

    fetchData();
  }, [yourCollectionName]);

  const handleTagChange = (tag: string) => {
    setSelectedTags((prevTags) => ({
      ...prevTags,
      [tag]: !prevTags[tag],
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() === "") return; // 空のタグは追加しない
    setSelectedTags((prevTags) => ({
      ...prevTags,
      [newTag]: false, // 新しいタグを初期化
    }));
    setNewTag(""); // 入力欄をクリア
  };

  const handleSearch = () => {
    const filteredResults = results.filter((item) => {
      const tagsData = item.tag || {}; // tagフィールドが存在しない場合は空のオブジェクトとする

      return Object.entries(selectedTags).some(([tag, isChecked]) => {
        return isChecked && tagsData[tag] === true; // チェックされたタグがtrueのとき
      });
    });

    setResults(filteredResults); // フィルタリングした結果を更新
  };

  return (
    <SafeAreaView style={styles.container}>
      <ExpoStatusBar style="auto" />

      {/* タグ入力欄 */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newTag}
          placeholder="Add a new tag"
          onChangeText={setNewTag}
        />
        <Button title="Add Tag" onPress={handleAddTag} />
      </View>

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
        keyExtractor={(item) => item.id} // idをkeyExtractorに使用
        renderItem={({ item }) => (
          <View>
            {/* idとtag以外のフィールドを表示 */}
            {Object.entries(item).map(([key, value]) => {
              if (key !== "id" && key !== "tag") {
                return (
                  <Text key={key}>
                    {typeof value === "object"
                      ? JSON.stringify(value)
                      : String(value)}
                  </Text>
                );
              }
              return null; // idとtagは表示しない
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
  inputContainer: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
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
