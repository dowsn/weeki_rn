import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { fetchData } from 'src/utilities/api';
import { useUserContext } from '../../hooks/useUserContext';
import { createStyles } from '../../styles';

const ChatScreen = ({ initialConversationSessionId }) => {
  const { user, setUser, theme } = useUserContext();
  const styles = createStyles(theme);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversationSessionId, setConversationSessionId] = useState(initialConversationSessionId || null);
  const [isLoading, setIsLoading] = useState(true);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const initializeChat = async () => {
      if (conversationSessionId) {
        await fetchMessages();
      } else {
        await createConversationSession();
      }
      setIsLoading(false);
    };

    initializeChat();
  }, []);

  const fetchMessages = async () => {
    try {
      const data = await fetchData(`chat-sessions/${conversationSessionId}/`, 'GET');
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const createConversationSession = async () => {
    try {
      const response = await fetchData('/api/chat-sessions/', 'POST');
      setConversationSessionId(response.conversationSessionId);
    } catch (error) {
      console.error('Error creating conversation session:', error);
    }
  };

  const sendMessage = async () => {
    if (newMessage.trim() === '' || !conversationSessionId) return;

    const date_created = new Date().toISOString();

    try {
      const response = await fetchData(
        `/api/chat-sessions/${conversationSessionId}/messages/`,
        'POST',
        { content: newMessage, date_created, user_id: user.id }
      );

      const userMessage = {
        content: newMessage,
        sender: 'user',
        date_created,
      };

      const assistantMessage = {
        content: response.content,
        sender: 'assistant',
        date_created: response.date_created,
      };

      setMessages(prevMessages => [...prevMessages, userMessage, assistantMessage]);
      setNewMessage('');

      scrollViewRef.current?.scrollToEnd({ animated: true });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderMessage = (message) => (
    <View
      key={message.id || message.date_created}
      style={[
        styles.chat.messageContainer,
        message.sender === 'user'
          ? styles.chat.myMessageContainer
          : styles.chat.otherMessageContainer
      ]}
    >
      <View
        style={[
          styles.chat.messageBubble,
          message.sender === 'user'
            ? styles.chat.myMessageBubble
            : styles.chat.otherMessageBubble,
        ]}
      >
        <Text
          style={
            message.sender === 'user'
              ? styles.chat.myMessageText
              : styles.chat.otherMessageText
          }
        >
          {message.content}
        </Text>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.chat.container}>
        <Text>Loading chat...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.chat.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.chat.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.chat.messagesContainer}
          contentContainerStyle={styles.chat.messagesContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
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