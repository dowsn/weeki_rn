import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useUserContext } from 'src/hooks/useUserContext';

const Message = ({ id, sender, date_created, text}) => {

  const { user, theme } = useUserContext();

  const styles = StyleSheet.create({
    messageContainer: {
      width: '100%',
      marginBottom: theme.spacing.small,
      alignItems: 'center',
    },

    messageBubble: {
      width: '100%',
      padding: theme.spacing.medium,
      borderRadius: theme.borderRadii.large,
      backgroundColor: sender === 'assistant' ? theme.colors.mr_week : theme.colors.me,
    },
    messageText: {
      color: 'black',
      fontSize: theme.fontSizes.medium,
    },
  });

  return (
    <View key={id || date_created} style={styles.messageContainer}>
      <View style={styles.messageBubble}>
        <Text style={styles.messageText}>{text}</Text>
      </View>
    </View>
  );
};

export default Message;
