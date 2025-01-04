import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'src/components/common/Text';
import { useUserContext } from '../../hooks/useUserContext';

const CustomTitle = ({ children, user = true, styles: customStyles }) => {
  const { theme } = useUserContext();

  const styles = StyleSheet.create({
    text: {
      padding: theme.spacing.large,
      color: user ? theme.colors.yellow_light : theme.colors.violet_light,
      textAlign: 'center',
      fontSize: theme.fontSizes.medium,
      fontWeight: '600',
      letterSpacing: 0.5,
    },
  });

  return <Text style={[styles.text, customStyles]}>{children}</Text>;
};

export default CustomTitle;
