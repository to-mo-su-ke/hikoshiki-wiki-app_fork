import React, { useState } from "react";
import { View, Text, StyleSheet,ScrollView } from "react-native";
import { Menu, Button, Provider } from "react-native-paper";

const ClubSearch = () => {
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [selectedValue1, setSelectedValue1] = useState(null);
  const [selectedValue2, setSelectedValue2] = useState(null);

  const openMenu1 = () => setVisible1(true);
  const closeMenu1 = () => setVisible1(false);

  const openMenu2 = () => setVisible2(true);
  const closeMenu2 = () => setVisible2(false);

  return (
    <Provider>
      <View style={styles.container}>
        <ScrollView>
        <Menu
          visible={visible1}
          onDismiss={closeMenu1}
          anchor={<Button onPress={openMenu1}>選択してください...</Button>}
        >
          <Menu.Item onPress={() => { setSelectedValue1('運動系部活'); closeMenu1(); }} title="運動系部活" />
          <Menu.Item onPress={() => { setSelectedValue1('文化系部活'); closeMenu1(); }} title="文化系部活" />
          <Menu.Item onPress={() => { setSelectedValue1('公認運動系サークル'); closeMenu1(); }} title="公認運動系サークル" />
          <Menu.Item onPress={() => { setSelectedValue1('公認文化系サークル'); closeMenu1(); }} title="公認文化系サークル" />
        </Menu>
        <Menu
          visible={visible2}
          onDismiss={closeMenu2}
          anchor={<Button onPress={openMenu2}>選択してください...</Button>}
        >
          <Menu.Item onPress={() => { setSelectedValue2('0~5000'); closeMenu2(); }} title="0~5000" />
          <Menu.Item onPress={() => { setSelectedValue2('5000~10000'); closeMenu2(); }} title="5000~10000" />
          <Menu.Item onPress={() => { setSelectedValue2('100000~'); closeMenu2(); }} title="100000~" />
          <Menu.Item onPress={() => { setSelectedValue2('~200000'); closeMenu2(); }} title="~200000" />
        </Menu>
        <Text style={styles.result}>
          選択された値: {selectedValue1 || "未選択"}
        </Text>
        <Text style={styles.result}>
          選択された値: {selectedValue2 || "未選択"}
        </Text>
        </ScrollView>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  result: {
    marginTop: 16,
  },
});

export default ClubSearch;