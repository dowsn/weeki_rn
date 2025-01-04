import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const SubscriptionScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Subscription Screen</Text>
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

export default SubscriptionScreen;