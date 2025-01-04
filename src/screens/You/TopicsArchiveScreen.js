import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const TopicsArchiveScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Topic Archive Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    color: '#000',
  },
});

export default TopicsArchiveScreen;