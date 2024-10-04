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
import { useUserContext } from '../../hooks/useUserContext';
import { createStyles } from '../../styles';
import { Message } from '../../types/message';
import { fetchData } from '../../utils/api';

interface ChatScreenProps {
  initialConversationSessionId?: string;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ initialConversationSessionId }) => {
  const { user, setUser, theme } = useUserContext();
  const styles = createStyles(theme);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversationSessionId, setConversationSessionId] = useState<string | null>(initialConversationSessionId || null);
  const [isLoading, setIsLoading] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);

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
      const data = await fetchData<Message[]>(`chat-sessions/${conversationSessionId}/`, 'GET');
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const createConversationSession = async () => {
    try {
      const response = await fetchData<{ conversationSessionId: string }>('/api/chat-sessions/', 'POST');
      setConversationSessionId(response.conversationSessionId);
    } catch (error) {
      console.error('Error creating conversation session:', error);
    }
  };

  const sendMessage = async () => {
    if (newMessage.trim() === '' || !conversationSessionId) return;

    try {
      const response = await fetchData<{ content: string }>(
        `/api/chat-sessions/${conversationSessionId}/messages/`,
        'POST',
        { message: newMessage }
      );

      const userMessage: Message = {
        id: Date.now().toString(),
        text: newMessage,
        sender: 'user',
      };

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.content,
        sender: 'assistant',
      };

      setMessages(prevMessages => [...prevMessages, userMessage, assistantMessage]);
      setNewMessage('');

      // Scroll to the bottom after sending a message
      scrollViewRef.current?.scrollToEnd({ animated: true });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderMessage = (message: Message) => (
    <View
      key={message.id}
      style={[
        styles.chat.messageContainer,
        message.sender === 'user'
          ? styles.chat.myMessageContainer
          : styles.chat.otherMessageContainer,
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
          {message.text}
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