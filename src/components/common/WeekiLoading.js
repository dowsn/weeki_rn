import React from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import { useUserContext } from 'src/hooks/useUserContext';

const WeekiLoading = () => {

  const {theme} = useUserContext();

  const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.violet_darkest,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
});

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/icons/Logo_Violet.png')}
        style={styles.logo}
      />
      <ActivityIndicator size="large" color={theme.colors.violet_light} />
    </View>
  );
};


export default WeekiLoading;