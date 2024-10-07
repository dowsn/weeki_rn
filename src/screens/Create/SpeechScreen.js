import { createClient, LiveTranscriptionEvents } from '@deepgram/sdk';
import { Audio } from 'expo-av';
import Constants from 'expo-constants';
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
import { fetchData } from 'src/utilities/api';
import { useUserContext } from '../../hooks/useUserContext';
import { createStyles } from '../../styles';

const SpeechScreen = ({ initialConversationSessionId }) => {
  const { user, setUser, theme } = useUserContext();
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
  const deepgramConnection = useRef(null);
  const silenceTimeoutRef = useRef(null);
  useEffect(() => {
    setIsLoading(false);
    ``;

    return () => {
      if (deepgramConnection.current) {
        deepgramConnection.current.close();
      }
    };
  }, []);

    const toggleRecording = () => {
      if (isRecording) {
        stopRecording();
      } else {
        startRecording();
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

      const DEEPGRAM_API_KEY = Constants.expoConfig.extra.deepgramApiKey;
      console.log('Deepgram API Key:', DEEPGRAM_API_KEY); // Make sure this logs correctly

      try {

        const deepgram = createClient(DEEPGRAM_API_KEY);
        console.log("tady");
         const connection = deepgram.listen.live({
           model: 'nova-2',
           language: 'en-US',
           smart_format: true,
            interim_results: true,
         });

        console.log('Deepgram connection created successfully');

        connection.on(LiveTranscriptionEvents.Open, () => {
          console.log('Deepgram connection opened');
        });

        connection.on(LiveTranscriptionEvents.Transcript, (data) => {
          const transcript = data.channel.alternatives[0].transcript;
          setProvisionalText(transcript);

          if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
          }
          silenceTimeoutRef.current = setTimeout(() => {
            stopRecording();
          }, 4000);
        });

        connection.on(LiveTranscriptionEvents.Error, (error) => {
          console.error('Deepgram error:', error);
          Alert.alert(
            'Transcription Error',
            'An error occurred during transcription. Please try again.',
          );
          stopRecording();
        });

        // Start sending audio data to Deepgram
        const sendAudioData = async () => {
          while (isRecording) {
            const { sound, status } =
              await recording.createNewLoadedSoundAsync();
            const audioBuffer = await sound.getStatusAsync();
            if (
              deepgramConnection.current &&
              deepgramConnection.current.getReadyState() === 1
            ) {
              deepgramConnection.current.send(audioBuffer);
            } else {
              console.log('Deepgram connection not ready, stopping recording');
              await stopRecording();
              break;
            }
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        };

        sendAudioData();
      } catch (deepgramError) {
        console.error('Failed to create Deepgram connection:', deepgramError);
        Alert.alert(
          'Connection Error',
          'Failed to establish transcription service. Please try again later.',
        );
        await stopRecording();
      }
    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert(
        'Recording Error',
        'An error occurred while starting the recording. Please try again.',
      );
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    if (recordingInstance) {
      try {
        await recordingInstance.stopAndUnloadAsync();
      } catch (error) {
        console.error('Error stopping recording:', error);
      }
      setRecordingInstance(null);
    }
    if (deepgramConnection.current) {
      try {
        await deepgramConnection.current.close();
      } catch (error) {
        console.error('Error closing Deepgram connection:', error);
      }
    }
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }
    if (provisionalText.trim()) {
      sendMessage(provisionalText.trim());
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
