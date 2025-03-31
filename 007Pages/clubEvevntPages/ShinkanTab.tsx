import React from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import EventSearch from './Search';
import { useNavigation } from '@react-navigation/native';

const ShinkanTab = () => {
  const navigation = useNavigation();
  
  const handleCreateEvent = () => {
    navigation.navigate('EventRegist');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>新歓イベント</Text>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={handleCreateEvent}
          >
            <Text style={styles.createButtonText}>新歓を登録</Text>
          </TouchableOpacity>
        </View>
        
        <EventSearch navigation={navigation} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  createButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default ShinkanTab;
