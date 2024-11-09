import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useUserContext } from 'src/hooks/useUserContext';

const LoadingAnimation = () => {

  const { theme } = useUserContext();
  return (
    <View style={styles.container}>
      <ActivityIndicator size="medium" color={theme.colors.onBackground} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingAnimation;