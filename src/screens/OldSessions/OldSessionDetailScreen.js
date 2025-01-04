import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const OldSessionDetailScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Old Sessions Detail Screen</Text>
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

export default OldSessionDetailScreen;