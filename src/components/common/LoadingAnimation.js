import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useUserContext } from 'src/hooks/useUserContext';

const fallbackStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.violet_darkest,
    },
  });

const LoadingAnimation = () => {
  const { theme } = useUserContext();

  // Move styles creation outside of render
  const styles = theme?.colors ? createStyles(theme.colors) : fallbackStyles;

  return (
    <View style={styles.container}>
      <ActivityIndicator
        size="medium"
        color={theme?.colors?.violet_light || '#fff'}
      />
    </View>
  );
};

export default LoadingAnimation;
