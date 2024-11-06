import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { useUserContext } from 'src/hooks/useUserContext';

const WriteScreen = () => {
  const { theme } = useUserContext();

  const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: '100%',
    padding: theme.spacing.small,
    borderWidth: 0,
    textAlignVertical: 'top',
    color: theme.colors.onSurface,
    fontSize: theme.fontSizes.medium,
    backgroundColor: theme.colors.background,
    },

  });

  return (
    <TextInput
      style={styles.input}
      multiline
      placeholder="Start typing..."
      placeholderTextColor="#999"
      textAlignVertical="top"
    />
  );
};

export default WriteScreen;
