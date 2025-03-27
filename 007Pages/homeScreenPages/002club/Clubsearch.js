import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { getFirestore, collection, query, getDocs, where } from 'firebase/firestore';
import app from '../../../004BackendModules/messageMetod/firestore';

const ClubSearch = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const db = getFirestore(app);
  
  useEffect(() => {
    if (searchText.length >= 2) {
      searchClubs();
    } else {
      loadInitialClubs();
    }
  }, [searchText]);
  
  const loadInitialClubs = async () => {
    setLoading(true);
    try {
      const clubsRef = collection(db, 'clubs');
      const q = query(clubsRef);
      const querySnapshot = await getDocs(q);
      
      const clubsList = [];
      querySnapshot.forEach((doc) => {
        clubsList.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setClubs(clubsList);
    } catch (error) {
      console.error('Error loading clubs:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const searchClubs = async () => {
    setLoading(true);
    try {
      const clubsRef = collection(db, 'clubs');
      // 検索ロジック：部活名、カテゴリ、説明文などで検索
      const q = query(
        clubsRef,
        where('name', '>=', searchText),
        where('name', '<=', searchText + '\uf8ff')
      );
      
      const querySnapshot = await getDocs(q);
      
      const clubsList = [];
      querySnapshot.forEach((doc) => {
        clubsList.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setClubs(clubsList);
    } catch (error) {
      console.error('Error searching clubs:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const renderClubItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.clubItem}
      onPress={() => navigation.navigate('ClubDetail', { clubId: item.id })}
    >
      <Text style={styles.clubName}>{item.name}</Text>
      <Text style={styles.clubCategory}>{item.category}</Text>
      <Text numberOfLines={2} style={styles.clubDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>部活動検索</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="部活名・カテゴリなどで検索"
        value={searchText}
        onChangeText={setSearchText}
      />
      
      {loading ? (
        <Text style={styles.loadingText}>読み込み中...</Text>
      ) : clubs.length > 0 ? (
        <FlatList
          data={clubs}
          renderItem={renderClubItem}
          keyExtractor={item => item.id}
          style={styles.clubsList}
        />
      ) : (
        <Text style={styles.noResults}>
          {searchText.length < 2 ? "検索するには2文字以上入力してください" : "該当する部活動がありません"}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1e3a8a",
  },
  searchInput: {
    height: 48,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 20,
    backgroundColor: "#ffffff",
    fontSize: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  clubsList: {
    flex: 1,
  },
  clubItem: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  clubName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#1e3a8a",
  },
  clubCategory: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 6,
  },
  clubDescription: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
  },
  loadingText: {
    textAlign: "center",
    marginTop: 40,
    color: "#64748b",
    fontSize: 16,
  },
  noResults: {
    textAlign: "center",
    marginTop: 40,
    color: "#64748b",
    fontSize: 16,
  }
});

export default ClubSearch;
