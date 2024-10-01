import { StyleSheet } from 'react-native';

export default (theme) =>
  StyleSheet.create({
    messagesContainer: {
      flex: 1,
    },
    messagesContent: {
      padding: 16,
    },

    messageContainer: {
      marginBottom: 16,
    },
    myMessageContainer: {
      alignItems: 'flex-end',
    },
    otherMessageContainer: {
      alignItems: 'flex-start',
    },
    messageBubble: {
      maxWidth: '80%',
      padding: 12,
      borderRadius: 20,
    },
    myMessageBubble: {
      backgroundColor: '#007AFF',
    },
    otherMessageBubble: {
      backgroundColor: '#E5E5EA',
    },
    myMessageText: {
      color: 'white',
    },
    otherMessageText: {
      color: 'black',
    },
    inputContainer: {
      padding: 16,
      backgroundColor: 'white',
      borderTopWidth: 1,
      borderTopColor: '#E5E5EA',
    },

    oneLineInput: {
      height: 40,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 20,
      paddingHorizontal: 16,
      fontSize: 16,
    },
  });