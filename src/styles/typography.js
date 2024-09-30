// src/styles/typography.js
import { StyleSheet } from 'react-native';

export default (theme) =>
  StyleSheet.create({
    h1: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.medium,
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.small,
    },
    h3: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.small,
    },
    body: {
      fontSize: theme.fontSizes.medium,
      color: theme.colors.text,
      lineHeight: 24,
    },
    caption: {
      fontSize: theme.fontSizes.small,
      color: theme.colors.text,
      opacity: 0.7,
    },
    button: {
      fontSize: theme.fontSizes.medium,
      fontWeight: '600',
      textTransform: 'uppercase',
    },
    // Add more typography styles as needed
  });
