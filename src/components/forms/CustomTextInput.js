import { useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { useUserContext } from '../../hooks/useUserContext';
import { createStyles } from '../../styles';

const CustomTextInput = ({
  placeholder,
  secureTextEntry = false,
  style,
  ...props
}) => {
  const { user, setUser, theme } = useUserContext();
  const { colors } = useTheme();

  const customStyles = StyleSheet.create({
    textInput: {
      height: theme.spacing.large,
      padding: theme.spacing.small,
      fontSize: theme.fontSizes.medium,
      borderRadius: theme.borderRadii.large,
      color: theme.colors.dark,
      backgroundColor: theme.colors.lightest,
    },
  });

  return (
    <TextInput
      style={[customStyles.textInput, style]}
      placeholder={placeholder}
      placeholderTextColor={colors.text}
      secureTextEntry={secureTextEntry}
      autoCapitalize="none"
      {...props}
    />
  );
};

export default CustomTextInput;
