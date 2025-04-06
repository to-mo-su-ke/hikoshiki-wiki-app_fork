import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../006Configs/firebaseConfig';

const ClubDetail = ({ route }) => {
  const { clubId } = route.params;
  const [club, setClub] = useState(null);

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const clubDocRef = doc(db, 'clubtest', clubId);
        const clubDoc = await getDoc(clubDocRef);
        if (clubDoc.exists()) {
          setClub(clubDoc.data());
        }
      } catch (error) {
        console.error('Error fetching club details: ', error);
      }
    };

    fetchClub();
  }, [clubId]);

  if (!club) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.clubName}>{club.name}</Text>
      
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>説明</Text>
        <Text style={styles.sectionContent}>{club.explain || "説明がありません"}</Text>
      </View>
      
      {/* 他の情報もセクションごとに同様のスタイルで表示 */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  clubName: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#334155",
  },
  sectionContent: {
    fontSize: 15,
    lineHeight: 22,
    color: "#475569",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#64748b",
    marginTop: 8,
  },
});

export default ClubDetail;