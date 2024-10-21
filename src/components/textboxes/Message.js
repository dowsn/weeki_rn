import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useUserContext } from './UserContext'; // Assuming you have a UserContext

const Message = ({ id, sender, date_created, text, profilePicture }) => {
  const { theme } = useUserContext();

  const styles = StyleSheet.create({
    messageContainer: {
      flexDirection: 'row',
      marginBottom: 16,
      alignItems: 'flex-end',
    },
    userMessageContainer: {
      justifyContent: 'flex-end',
    },
    assistantMessageContainer: {
      justifyContent: 'flex-start',
    },
    messageBubble: {
      maxWidth: '70%',
      padding: 12,
      borderRadius: 20,
    },
    userMessageBubble: {
      backgroundColor: '#007AFF',
      marginLeft: 8,
    },
    assistantMessageBubble: {
      backgroundColor: '#E5E5EA',
      marginRight: 8,
    },
    userMessageText: {
      color: 'white',
    },
    assistantMessageText: {
      color: 'black',
    },
    profilePicture: {
      width: 36,
      height: 36,
      borderRadius: 18,
    },
    // ... (keep other styles from your original code)
  });

  const isUser = sender === 'user';

  return (
    <View
      key={id || date_created}
      style={[
        styles.messageContainer,
        isUser ? styles.userMessageContainer : styles.assistantMessageContainer,
      ]}
    >
      {!isUser && (
        <Image
          source={{ uri: profilePicture }}
          style={styles.profilePicture}
        />
      )}
      <View
        style={[
          styles.messageBubble,
          isUser ? styles.userMessageBubble : styles.assistantMessageBubble,
        ]}
      >
        <Text
          style={isUser ? styles.userMessageText : styles.assistantMessageText}
        >
          {text}
        </Text>
      </View>
      {isUser && (
        <Image
          source={{ uri: profilePicture }}
          style={styles.profilePicture}
        />
      )}
    </View>
  );
};



export default Message
