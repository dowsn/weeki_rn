import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useUserContext } from '../../hooks/useUserContext';
import { createStyles } from '../../styles';
import createScreenStyles from './ChatScreen.styles';

const ChatScreen = () => {
  const { user, setUser, theme } = useUserContext();
   const styles = createStyles(theme);
   const screenStyles = createScreenStyles(theme);

  const messages = [
    { id: 1, text: 'Hey there!', sender: 'me' },
    { id: 2, text: 'Hi! How are you?', sender: 'other' },
    { id: 3, text: "I'm doing great, thanks for asking!", sender: 'me' },
    { id: 4, text: "That's wonderful to hear!", sender: 'other' },
    { id: 5, text: 'How about you?', sender: 'me' },
  ];

  const renderMessage = (message) => (
    <View
      key={message.id}
      style={[
        styles.chat.messageContainer,
        message.sender === 'me'
          ? styles.chat.myMessageContainer
          : styles.chat.otherMessageContainer,
      ]}
    >
      <View
        style={[
          styles.chat.messageBubble,
          message.sender === 'me'
            ? styles.chat.myMessageBubble
            : styles.chat.otherMessageBubble,
        ]}
      >
        <Text
          style={
            message.sender === 'me'
              ? styles.chat.myMessageText
              : styles.chat.otherMessageText
          }
        >
          {message.text}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.chat.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.chat.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView
          style={styles.chat.messagesContainer}
          contentContainerStyle={styles.chat.messagesContent}
        >
          {messages.map(renderMessage)}
        </ScrollView>
        <View style={styles.chat.inputContainer}>
          <TextInput
            style={styles.chat.oneLineInput}
            placeholder="Type a message..."
            placeholderTextColor="#999"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

});

export default ChatScreen;
