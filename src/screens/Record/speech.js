import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
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
import { fetchData } from 'src/utils/api';
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
  const silenceTimerRef = useRef(null);
  const [audioFile, setAudioFile] = useState(null);

  const RECORDING_OPTIONS = {
    android: {
      extension: '.m4a',
      outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
      audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
    },
    ios: {
      extension: '.m4a',
      audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
  };

  useEffect(() => {
    initializeWebSocket();
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      stopRecording();
    };
  }, []);

  const initializeWebSocket = () => {
    socketRef.current = new WebSocket(`wss://${host}/listen`);
    console.log(`Connecting to WebSocket: wss://${host}/listen`);

    socketRef.current.onopen = () => {
      console.log('WebSocket connection opened');
      setIsLoading(false);
    };

    socketRef.current.onmessage = (event) => {
      console.log('Received WebSocket message:', event.data);
      try {
        const received = JSON.parse(event.data);
        if (received.transcript) {
          console.log(
            'Transcript:',
            received.transcript,
            'Is final:',
            received.is_final,
          );
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
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };

    socketRef.current.onclose = (event) => {
      console.log('WebSocket connection closed:', event.code, event.reason);
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
      console.log('Silence detected, stopping recording');
      stopRecording();
    }, 8000); // 8 seconds of silence
  };

  const toggleRecording = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  const startRecording = async () => {
    try {
      console.log('Requesting audio recording permission');
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Audio recording permission denied');
        Alert.alert(
          'Permission Denied',
          'Please grant microphone permissions to use this feature.',
        );
        return;
      }

      console.log('Setting audio mode');
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      if (recordingInstance) {
        console.log('Stopping existing recording');
        await recordingInstance.stopAndUnloadAsync();
      }

      console.log('Creating new recording instance');
      const newRecording = new Audio.Recording();
      try {
        await newRecording.prepareToRecordAsync(RECORDING_OPTIONS);
        console.log('Recording prepared successfully');
        await newRecording.startAsync();
        console.log('Recording started successfully');
        setRecordingInstance(newRecording);
        setIsRecording(true);

        if (
          socketRef.current &&
          socketRef.current.readyState === WebSocket.OPEN
        ) {
          console.log('Sending start signal to WebSocket');
          socketRef.current.send(JSON.stringify({ action: 'start' }));
        } else {
          console.error('WebSocket is not open. Cannot send start signal.');
        }

        updateLastTranscriptTime();

        // Start sending audio data
        await sendAudioData(newRecording);
      } catch (error) {
        console.error('Error preparing or starting recording:', error);
      }
    } catch (error) {
      console.error('Error in startRecording:', error);
      Alert.alert(
        'Recording Error',
        'An error occurred while starting the recording. Please try again.',
      );
    }
  };

  const stopRecording = async () => {
    console.log('Stopping recording');
    setIsRecording(false);
    if (recordingInstance) {
      try {
        await recordingInstance.stopAndUnloadAsync();
      } catch (error) {
        console.error('Error stopping recording:', error);
      }
      setRecordingInstance(null);
    }

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      console.log('Sending stop signal to WebSocket');
      socketRef.current.send(JSON.stringify({ action: 'stop' }));
    } else {
      console.error('WebSocket is not open. Cannot send stop signal.');
    }

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }

    if (provisionalText.trim()) {
      console.log(
        'Sending final transcript as message:',
        provisionalText.trim(),
      );
      sendMessage(provisionalText.trim());
    }
  };

  const sendAudioData = async (recording) => {
    console.log('Starting to send audio data');
    let chunkCounter = 0;
    const chunkSize = 4096; // Adjust this value as needed
    let allAudioData = new Uint8Array();

    while (isRecording) {
      try {
        const status = await recording.getStatusAsync();
        console.log('Recording status:', status);
        if (status.isRecording) {
          const { sound, status: newStatus } =
            await recording.createNewLoadedSoundAsync();
          console.log('New sound status:', newStatus);
          const audioBuffer = await sound.getStatusAsync();
          console.log('Audio buffer status:', audioBuffer);

          if (audioBuffer.isLoaded && audioBuffer.durationMillis > 0) {
            const audioData = await FileSystem.readAsStringAsync(
              recording.getURI(),
              { encoding: FileSystem.EncodingType.Base64 },
            );
            const uint8Array = new Uint8Array(
              atob(audioData)
                .split('')
                .map((char) => char.charCodeAt(0)),
            );
            allAudioData = new Uint8Array([...allAudioData, ...uint8Array]);

            for (let i = 0; i < uint8Array.length; i += chunkSize) {
              const chunk = uint8Array.slice(i, i + chunkSize);
              if (
                socketRef.current &&
                socketRef.current.readyState === WebSocket.OPEN
              ) {
                chunkCounter++;
                console.log(
                  `Sending audio chunk ${chunkCounter} to WebSocket. Size: ${chunk.length} bytes`,
                );
                socketRef.current.send(chunk);
                updateLastTranscriptTime(); // Reset silence timer on each chunk sent
              } else {
                console.log(
                  'WebSocket connection not ready, stopping recording',
                );
                break;
              }
            }
          } else {
            console.log('Audio buffer not loaded or duration is 0');
          }
          await sound.unloadAsync();
        } else {
          console.log('Recording is not active');
          break;
        }
      } catch (error) {
        console.error('Error processing audio:', error);
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    console.log(
      `Finished sending audio data. Total chunks sent: ${chunkCounter}`,
    );

    // Save all audio data to a file
    if (allAudioData.length > 0) {
      const fileUri = `${FileSystem.documentDirectory}audio_${Date.now()}.wav`;
      await FileSystem.writeAsStringAsync(
        fileUri,
        btoa(String.fromCharCode.apply(null, allAudioData)),
        { encoding: FileSystem.EncodingType.Base64 },
      );
      console.log('Audio file saved:', fileUri);
      setAudioFile(fileUri);
    } else {
      console.log('No audio data collected');
    }
  };

  const sendMessage = async (content) => {
    if (!content.trim() || !conversationSessionId) return;

    const date_created = new Date().toISOString();

    try {
      console.log('Sending message:', content);
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
