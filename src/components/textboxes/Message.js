import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useUserContext } from 'src/hooks/useUserContext';

const Message = ({
  id,
  sender,
  date_created,
  text,
  profilePicture = require('../../../assets/images/mr_week_profile_picture.png'),
}) => {
  const { theme } = useUserContext();

  const styles = StyleSheet.create({
    messageContainer: {
      flexDirection: 'row',
      marginBottom: 8, // Reduced from 16
      alignItems: 'flex-end',
    },
    userMessageContainer: {
      justifyContent: 'flex-end',
    },
    assistantMessageContainer: {
      justifyContent: 'flex-start',
    },
    messageBubble: {
      maxWidth: '80%', // Increased from 70%
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
    container: {
      flex: 1,
    },
    inputContainer: {
      flexDirection: 'row',
      padding: 8,
      backgroundColor: 'white',
      borderTopWidth: 1,
      borderTopColor: '#E5E5EA',
    },
    input: {
      flex: 1,
      padding: 10,
      backgroundColor: '#F2F2F7',
      borderRadius: 20,
      marginRight: 8,
      maxHeight: 100,
    },
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
        <Image source={profilePicture} style={styles.profilePicture} />
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
        <Image source={profilePicture} style={styles.profilePicture} />
      )}
    </View>
  );
};

export default Message;