import { useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput } from 'src/components/common/Text';
import { useUserContext } from '../../hooks/useUserContext';

const CustomTextInput = ({ placeholder, ...props }) => {
  const { theme } = useUserContext();
  const { colors } = useTheme();

  const customStyles = StyleSheet.create({
    container: {
      borderColor: theme.colors.yellow_light,
      borderWidth: 1,
      borderRadius: theme.borderRadii.large * 2,
      backgroundColor: theme.colors.yellow_light,
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
        placeholderTextColor={theme.colors.gray}
        placeholder={placeholder}
        {...props}
      />
    </View>
  );
};

export default CustomTextInput;
