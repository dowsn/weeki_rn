import React from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';

const WeekiLoading = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('assets/logo/WeekiLogo.png')}
        style={styles.logo}
      />
      <ActivityIndicator size="large" color="#0000ff" />
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
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
});

export default WeekiLoading;