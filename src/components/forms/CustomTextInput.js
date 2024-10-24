import { useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useUserContext } from '../../hooks/useUserContext';

const CustomTextInput = ({ placeholder, ...props }) => {
  const { theme } = useUserContext();
  const { colors } = useTheme();

  const customStyles = StyleSheet.create({
    container: {
      borderColor: theme.colors.onSurfaceVariant,
      borderWidth: 1,
      borderRadius: theme.borderRadii.large,
      backgroundColor: theme.colors.surface,
      justifyContent: 'center',
    },
    textInput: {
      height: theme.spacing.large * 2,
      fontSize: theme.fontSizes.medium,
      color: theme.colors.onSurface,
      textAlign: 'center', // Center the text
    },
  });

  return (
    <View style={customStyles.container}>
      <TextInput
        style={customStyles.textInput}
        autoCapitalize="none"
        placeholderTextColor={theme.colors.onSurfaceVariant}
        placeholder={placeholder}
        {...props}
      />
    </View>
  );
};

export default CustomTextInput;
