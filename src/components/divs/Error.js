import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

const Error = ({ message }) => {
  return (
    <SafeAreaView>
      <Text style={styles.error}>{message}</Text>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  error: {
    fontSize: 20,
    color: 'white',
    // marginHorizontal: 20,
    textAlign: 'center',
    backgroundColor: 'red',
    width: '100%',
  },
});

export default Error;