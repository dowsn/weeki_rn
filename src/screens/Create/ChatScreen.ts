import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useUserContext } from '../../hooks/useUserContext';
import { createStyles } from '../../styles';
import { Message, NewMessage } from '../../types/message';
import { fetchData } from '../../utils/api';
import createScreenStyles from './ChatScreen.styles';

const ChatScreen: React.FC = () => {
  const { user, setUser, theme } = useUserContext();
  const styles = createStyles(theme);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const data = await fetchData<Message[]>('/api/messages', 'GET');
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (newMessage.trim() === '') return;

    const messageToSend: NewMessage = {
      text: newMessage,
      sender: 'me',
    };

    try {
      const data = await fetchData<Message>('/api/messages', 'POST', messageToSend);
      setMessages([...messages, data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderMessage = (message: Message) => (
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
            value={newMessage}
            onChangeText={setNewMessage}
          />
          <TouchableOpacity style={styles.chat.sendButton} onPress={sendMessage}>
            <Text style={styles.chat.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;