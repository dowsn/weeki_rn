import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useUserContext } from '../../hooks/useUserContext';

const Subtitle = ({ title }) => {
  const { user, setUser, theme } = useUserContext();

  const styles = StyleSheet.create({
    title: {
      fontSize: theme.fontSizes.medium,

      marginBottom: theme.spacing.medium,
      color: theme.colors.onBackground,
      textAlign: 'center',
    },
  });

  return <Text style={styles.title}>{title}</Text>;
};

export default MainTitle;
