import { useTheme } from '@react-navigation/native';
import React from 'react';
import {
  Platform,
  StyleSheet,
  TextInput as RNTextInput,
  View,
} from 'react-native';
import { useUserContext } from '../../hooks/useUserContext';

const CustomTextInput = ({ placeholder, ...props }) => {
  const { theme } = useUserContext();

  const customStyles = StyleSheet.create({
    container: {
      borderColor: theme.colors.yellow_light,
      borderWidth: 1,
      borderRadius: theme.borderRadii.large * 2,
      backgroundColor: theme.colors.yellow_light,
      overflow: 'hidden',
    },
    textInput: {
      height: theme.spacing.large * 2,
      fontSize: theme.fontSizes.medium,
      color: theme.colors.onSurface,
      textAlign: 'center',
      ...Platform.select({
        ios: {
          paddingTop: 0,
          paddingBottom: 0,
          paddingHorizontal: 0,
          height: theme.spacing.large * 2,
        },
      }),
    },
  });

  // Use the platform-native TextInput directly instead of the custom one
  // This gives more direct control over the component's behavior
  return (
    <View style={customStyles.container}>
      <RNTextInput
        style={customStyles.textInput}
        autoCapitalize="none"
        multiline={false}
        blurOnSubmit={true}
        placeholderTextColor={theme.colors.gray}
        placeholder={placeholder}
        {...props}
      />
    </View>
  );
};

export default CustomTextInput;
