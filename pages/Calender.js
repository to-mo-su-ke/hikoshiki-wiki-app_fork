import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { format, addMonths, subMonths, addYears, subYears, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useNavigation } from '@react-navigation/native';

const events = [
  { date: new Date(2023, 9, 15), title: "Meeting with Bob" },
  { date: new Date(2023, 9, 20), title: "Dentist Appointment" },
  { date: new Date(2023, 9, 25), title: "Birthday Party" }
];

const renderEventIcon = (day) => {
  const hasEvent = events.some(event => isSameDay(event.date, day));
  if (hasEvent) {
    return (
      <View style={{ width: 10, height: 10, backgroundColor: 'red', borderRadius: 5, marginTop: 5 }} />
    );
  }
  return null;
};

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigation = useNavigation();

  const handleDateClick = (day) => {
    setSelectedDate(day);
    navigation.navigate('DayEvents', { date: format(day, 'yyyy-MM-dd') });
  };

  const renderHeader = () => {
    const dateFormat = "yyyy年 MMMM";

    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
        <TouchableOpacity onPress={() => setCurrentMonth(subYears(currentMonth, 1))}>
          <Text>年＜-</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          <Text>月＜-</Text>
        </TouchableOpacity>
        <Text>{format(currentMonth, dateFormat, { locale: ja })}</Text>
        <TouchableOpacity onPress={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          <Text>月＞-</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentMonth(addYears(currentMonth, 1))}>
          <Text>年＞-</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderDays = () => {
    const days = [];
    const startDate = startOfWeek(currentMonth, { locale: ja });
    for (let i = 0; i < 7; i++) {
      days.push(
        <View key={i} style={{ flex: 1, alignItems: 'center' }}>
          <Text>{format(addDays(startDate, i), 'EEEE', { locale: ja })}</Text>
        </View>
      );
    }
    return <View style={{ flexDirection: 'row' }}>{days}</View>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;
        days.push(
          <TouchableOpacity
            key={day}
            style={{
              flex: 1,
              alignItems: 'center',
              padding: 10,
              backgroundColor: !isSameMonth(day, monthStart) ? '#eee' : isSameDay(day, selectedDate) ? '#ddd' : '#fff'
            }}
            onPress={() => handleDateClick(cloneDay)}
          >
            <Text>{formattedDate}</Text>
            {renderEventIcon(day)}
          </TouchableOpacity>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <View key={day} style={{ flexDirection: 'row' }}>
          {days}
        </View>
      );
      days = [];
    }
    return <View>{rows}</View>;
  };

  return (
    <View>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </View>
  );
};

export default Calendar;