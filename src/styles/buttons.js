import { StyleSheet } from 'react-native';

export default (theme) =>
  StyleSheet.create({
    base: {
      padding: theme.spacing.medium,
      borderRadius: 5,
      alignItems: 'center',
    },
    primary: {
      backgroundColor: theme.colors.primary,
    },
    secondary: {
      backgroundColor: theme.colors.secondary,
    },
    text: {
      color: theme.isDark ? theme.colors.background : theme.colors.text,
      fontSize: theme.fontSizes.medium,
    },
  });
