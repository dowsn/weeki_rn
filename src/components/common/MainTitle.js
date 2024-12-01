import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useUserContext } from '../../hooks/useUserContext';

const MainTitle = ({ title }) => {
  const { user, setUser, theme } = useUserContext();

  const styles = StyleSheet.create({
    title: {
      fontSize: theme.fontSizes.large,
      fontWeight: 'bold',
      marginBottom: theme.spacing.large,
      color: theme.colors.light,
      textAlign: 'center',
      marginTop: theme.spacing.large,
    },
  });

  return (
    <Text style={styles.title}>{title}</Text>
  );
};



export default MainTitle;