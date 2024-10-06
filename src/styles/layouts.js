// src/styles/layouts.js
import { StyleSheet } from 'react-native';

export default (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: theme.spacing.medium,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    column: {
      flexDirection: 'column',
    },
    centered: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    card: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadii.medium,
      padding: theme.spacing.medium,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    section: {
      marginBottom: theme.spacing.large,
    },



    // Add more layout styles as needed
  });
