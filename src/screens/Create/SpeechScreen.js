import { Audio } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { host } from 'src/constants/constants';
import { fetchData } from 'src/utilities/api';
import { useUserContext } from '../../hooks/useUserContext';
import { createStyles } from '../../styles';

const SpeechScreen = ({ initialConversationSessionId }) => {
  const { user, theme } = useUserContext();
  const styles = createStyles(theme);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversationSessionId, setConversationSessionId] = useState(
    initialConversationSessionId || null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingInstance, setRecordingInstance] = useState(null);
  const [provisionalText, setProvisionalText] = useState('');
  const scrollViewRef = useRef(null);
  const socketRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const silenceTimerRef = useRef(null);

  useEffect(() => {
    initializeWebSocket();
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const initializeWebSocket = () => {

    socketRef.current = new WebSocket(`wss://${host}/listen`);
    console.log(`wss://${host}listen`);
    socketRef.current.onopen = () => {
      console.log('WebSocket connection opened');
      setIsLoading(false);
    };

    socketRef.current.onmessage = (message) => {
      const received = JSON.parse(message.data);
      if (received.transcript) {
        if (received.is_final) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              content: received.transcript,
              sender: 'user',
              date_created: new Date().toISOString(),
            },
          ]);
          setProvisionalText('');
        } else {
          setProvisionalText(received.transcript);
        }
        updateLastTranscriptTime();
      }
    };

    socketRef.current.onclose = () => {
      console.log('WebSocket connection closed');
      setTimeout(initializeWebSocket, 3000);
    };

    socketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  };

  const updateLastTranscriptTime = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    silenceTimerRef.current = setTimeout(() => {
      stopRecording();
    }, 8000); // 8 seconds of silence
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

   const startRecording = async () => {
     try {
       const { status } = await Audio.requestPermissionsAsync();
       if (status !== 'granted') {
         Alert.alert(
           'Permission Denied',
           'Please grant microphone permissions to use this feature.',
         );
         return;
       }

       await Audio.setAudioModeAsync({
         allowsRecordingIOS: true,
         playsInSilentModeIOS: true,
       });

       const recording = new Audio.Recording();
       await recording.prepareToRecordAsync(
         Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY,
       );
       await recording.startAsync();
       setRecordingInstance(recording);
       setIsRecording(true);

       if (
         socketRef.current &&
         socketRef.current.readyState === WebSocket.OPEN
       ) {
         console.log('working here');
         socketRef.current.send(JSON.stringify({ action: 'start' }));
       } else {
         console.error('WebSocket is not open. Cannot send start signal.');
       }

       updateLastTranscriptTime();

       // Start sending audio data
       sendAudioData(recording);
     } catch (error) {
       console.error('Error starting recording:', error);
       Alert.alert(
         'Recording Error',
         'An error occurred while starting the recording. Please try again.',
       );
     }
   };

    const sendAudioData = async (recording) => {
      console.log('Starting to send audio data');
      while (isRecording) {
        if (recording.getStatusAsync().isRecording) {
          const { sound, status } = await recording.createNewLoadedSoundAsync();
          const audioBuffer = await sound.getStatusAsync();
          if (
            socketRef.current &&
            socketRef.current.readyState === WebSocket.OPEN
          ) {
            console.log('Sending audio chunk to WebSocket');
            socketRef.current.send(audioBuffer.uri);
          } else {
            console.log('WebSocket connection not ready, stopping recording');
            await stopRecording();
            break;
          }
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      console.log('Finished sending audio data');
    };

   const stopRecording = async () => {
     if (recordingInstance) {
       try {
         await recordingInstance.stopAndUnloadAsync();
       } catch (error) {
         console.error('Error stopping recording:', error);
       }
       setRecordingInstance(null);
     }

     setIsRecording(false);
     if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        console.log('Sending start signal to WebSocket');
       socketRef.current.send(JSON.stringify({ action: 'stop' }));
     } else {
       console.error('WebSocket is not open. Cannot send stop signal.');
     }

     if (silenceTimerRef.current) {
       clearTimeout(silenceTimerRef.current);
     }

     // Send the final transcript as a message
     if (provisionalText.trim()) {
       sendMessage(provisionalText.trim());
     }
   };

  const sendMessage = async (content) => {
    if (!content.trim() || !conversationSessionId) return;

    const date_created = new Date().toISOString();

    try {
      const response = await fetchData(
        `/api/chat-sessions/${conversationSessionId}/messages/`,
        'POST',
        { content, date_created, user_id: user.id },
      );

      const userMessage = {
        content,
        sender: 'user',
        date_created,
      };

      const assistantMessage = {
        content: response.content,
        sender: 'assistant',
        date_created: response.date_created,
      };

      setMessages((prevMessages) => [
        ...prevMessages,
        userMessage,
        assistantMessage,
      ]);
      setNewMessage('');
      setProvisionalText('');

      scrollViewRef.current?.scrollToEnd({ animated: true });
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }
  };

  const renderMessage = (message) => (
    <View
      key={message.id || message.date_created}
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
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {messages.map(renderMessage)}
          {provisionalText && (
            <View style={styles.chat.provisionalTextContainer}>
              <Text style={styles.chat.provisionalText}>{provisionalText}</Text>
            </View>
          )}
        </ScrollView>
        <View style={styles.chat.inputContainer}>
          <TextInput
            style={styles.chat.oneLineInput}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            value={newMessage}
            onChangeText={setNewMessage}
          />
          <TouchableOpacity
            style={styles.chat.sendButton}
            onPress={() => sendMessage(newMessage)}
          >
            <Text style={styles.chat.sendButtonText}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.chat.recordButton}
            onPress={toggleRecording}
          >
            <Icon
              name={isRecording ? 'stop' : 'mic'}
              size={24}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SpeechScreen;
