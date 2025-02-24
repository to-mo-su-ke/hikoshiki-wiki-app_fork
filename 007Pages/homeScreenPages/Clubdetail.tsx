import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../006Configs/firebaseConfig2';

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
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView>
    <View style={styles.container}>
      <Text style={styles.clubName}>{club.name}</Text>
      <Text> 説明:{club.explain} </Text>
      
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clubName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default ClubDetail;