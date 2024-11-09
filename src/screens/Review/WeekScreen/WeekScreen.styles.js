import { StyleSheet } from 'react-native';

export default (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: theme.spacing.large,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: theme.spacing.large,
    },
    formContainer: {
      marginBottom: theme.spacing.large,
    },
    submitButton: {
      marginTop: theme.spacing.medium,
    },
  });
