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
import { ASSISTANT_PROFILE_PICTURE } from 'src/constants/constants';
import { fetchData } from 'src/utils/api';
import { useUserContext } from '../../hooks/useUserContext';
import { createStyles } from '../../styles';

const ChatScreen = ({ initialConversationSessionId }) => {
  const { user, setUser, theme } = useUserContext();
  const styles = createStyles(theme);``
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversationSessionId, setConversationSessionId] = useState(initialConversationSessionId || null);
  const [isLoading, setIsLoading] = useState(true);
  const scrollViewRef = useRef(null);

  const ws = new WebSocket(`wss://api.hume.ai/v0/evi/chat?api_key=${apiKey}`);
  ws.onopen = () => {
    console.log('WebSocket connection opened');
  };

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  ws.onclose = () => {
    console.log('WebSocket connection closed');
  };
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
        { content: newMessage, date_created, user_id: user.id, profile_picture: user.profile_picture }
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
        profile_picture: ASSISTANT_PROFILE_PICTURE
      };

      setMessages(prevMessages => [...prevMessages, userMessage, assistantMessage]);
      setNewMessage('');

      scrollViewRef.current?.scrollToEnd({ animated: true });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderMessage = (message) => (
    <Message key={message.id || message.date_created} text={message.content} sender={message.sender} />
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading chat...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          <ChatList data={messages} />
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.oneLineInput}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            value={newMessage}
            onChangeText={setNewMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;