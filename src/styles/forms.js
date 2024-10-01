import { StyleSheet } from 'react-native';

export default (theme) =>
  StyleSheet.create({
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.small,
      fontSize: theme.fontSizes.medium,
      borderRadius: 4,
      color: theme.colors.text,
      backgroundColor: theme.colors.background,
    },
    label: {
      fontSize: theme.fontSizes.small,
      marginBottom: theme.spacing.small,
      color: theme.colors.text,
    },


  });
