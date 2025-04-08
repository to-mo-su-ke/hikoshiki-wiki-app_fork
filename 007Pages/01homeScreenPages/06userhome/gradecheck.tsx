import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../006Configs/firebaseConfig';

const Gradecheck = ({ route }) => {
  const { gradeId } = route.params;
  const { department } = route.params;
  const [grade, setgrade] = useState(null);
  



  useEffect(() => {
    const fetchgrade = async () => {
      try {
        const gradeDocRef = doc(db, 'grade', gradeId);
        const gradeDoc = await getDoc(gradeDocRef);
        if (gradeDoc.exists()) {
          setgrade(gradeDoc.data());
        }
      } catch (error) {
        console.error('Error fetching your grade: ', error);
      }
    };

    fetchgrade();
  }, [gradeId]);
  


  

  if (!grade) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView>
    <View style={styles.container}>
      
      <Text> あなたのGPA:{grade.gpaaverage} </Text>
        <Text> あなたの単位数:{grade.units} </Text>
        <Text> 卒業まであと:{grade.remainunits}単位 </Text>
    
        
      
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

export default Gradecheck;