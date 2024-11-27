import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { format, parseISO, isSameDay } from 'date-fns';

const events = [
  { date: new Date(2023, 9, 15), title: "Meeting with Bob" },
  { date: new Date(2023, 9, 20), title: "Dentist Appointment" },
  { date: new Date(2023, 9, 25), title: "Birthday Party" }
];

const DayEvents = () => {
  const route = useRoute();
  const { date } = route.params;
  const selectedDate = parseISO(date);
  const dayEvents = events.filter(event => isSameDay(event.date, selectedDate));

  return (
    <View>
      <Text>{format(selectedDate, 'yyyy-MM-dd')}の予定</Text>
      {dayEvents.length > 0 ? (
        <FlatList
          data={dayEvents}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <Text>{item.title}</Text>}
        />
      ) : (
        <Text>予定はありません。</Text>
      )}
    </View>
  );
};

export default DayEvents;