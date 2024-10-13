import { useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { useUserContext } from '../../hooks/useUserContext';
import { createStyles } from '../../styles';

const CustomTextInput = ({
  placeholder,
  ...props
}) => {
  const { user, setUser, theme } = useUserContext();
  const { colors } = useTheme();

  const customStyles = StyleSheet.create({
    textInput: {
      height: theme.spacing.large,
      padding: theme.spacing.large,
      fontSize: theme.fontSizes.medium,
      borderRadius: theme.borderRadii.large,
      color: theme.colors.onSurface,
      backgroundColor: theme.colors.surface,

    },
  });

  return (
    <TextInput
      style={customStyles.textInput}
      autoCapitalize="none"
      {...props}
    />
  );
};

export default CustomTextInput;
