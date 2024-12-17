import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useUserContext } from '../../hooks/useUserContext';

const CustomText = ({ children, user = true, styles: customStyles }) => {
  const { theme } = useUserContext();

  const styles = StyleSheet.create({
    text: {
      padding: theme.spacing.large,
      color: user ? theme.colors.yellow_light : theme.colors.violet_light,
      textAlign: 'center',
      fontSize: theme.fontSizes.small,
      fontWeight: '600',
      letterSpacing: 0.5,
    },
  });

  return <Text style={[styles.text, customStyles]}>{children}</Text>;
};

export default CustomText;
