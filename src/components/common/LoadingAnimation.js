import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useUserContext } from 'src/hooks/useUserContext';

const LoadingAnimation = () => {

  const { theme } = useUserContext();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.violet_darkest,
    },
  });

  return (
    <View style={styles.container}>
      <ActivityIndicator size="medium" color={theme.colors.violet_light} />
    </View>
  );
};



export default LoadingAnimation;