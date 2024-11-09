import { Audio } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { host } from 'src/constants/constants';

const SpeechScreen = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const socketRef = useRef(null);
  const recordingRef = useRef(null);
  const lastTranscriptTimeRef = useRef(Date.now());
  const silenceTimerRef = useRef(null);

  const SILENCE_THRESHOLD = 8000; // 8 seconds
  const SILENCE_CHECK_INTERVAL = 1000; // Check every second

  useEffect(() => {
    // initializeWebSocket();
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      stopRecording();
    };
  }, []);

  const initializeWebSocket = () => {
    socketRef.current = new WebSocket(`wss://${host}/listen`);

    socketRef.current.onopen = () => {
      console.log('WebSocket connection established');
    };

    socketRef.current.onmessage = (event) => {
      const received = JSON.parse(event.data);
      if (received.transcript) {
        console.log(
          'Received transcript:',
          received.transcript,
          'Is final:',
          received.is_final,
        );
        if (received.is_final) {
          setTranscript((prev) => prev + ' ' + received.transcript);
          setInterimTranscript('');
        } else {
          setInterimTranscript(received.transcript);
        }
        lastTranscriptTimeRef.current = Date.now();
      }
    };

    socketRef.current.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason);
      setTimeout(initializeWebSocket, 3000);
    };

    socketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  };

  const startRecording = async () => {
    try {
      console.log('Requesting permissions..');
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access microphone was denied');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      await recording.startAsync();
      recordingRef.current = recording;
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

      startSilenceDetection();
      sendAudioData();
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (recordingRef.current) {
      console.log('Stopping recording..');
      setIsRecording(false);
      try {
        await recordingRef.current.stopAndUnloadAsync();
      } catch (error) {
        console.error('Error stopping recording:', error);
      }
      recordingRef.current = null;

      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        console.log('Sending stop signal to WebSocket');
        socketRef.current.send(JSON.stringify({ action: 'stop' }));
      } else {
        console.error('WebSocket is not open. Cannot send stop signal.');
      }

      clearInterval(silenceTimerRef.current);
    }
  };

  const sendAudioData = async () => {
    console.log('Starting to send audio data');
    let chunkCounter = 0;
    while (isRecording && recordingRef.current) {
      try {
        const status = await recordingRef.current.getStatusAsync();
        if (status.isRecording) {
          const uri = recordingRef.current.getURI();
          const audioData = await Audio.getAudioDataAsync(uri);
          const audioBuffer = audioData.audioBuffer;

          if (
            socketRef.current &&
            socketRef.current.readyState === WebSocket.OPEN
          ) {
            chunkCounter++;
            console.log(
              `Sending audio chunk ${chunkCounter}. Size: ${audioBuffer.byteLength} bytes`,
            );
            socketRef.current.send(audioBuffer);
          } else {
            console.log('WebSocket not ready. Skipping chunk.');
          }
        } else {
          console.log('Recording is not active');
          break;
        }
      } catch (error) {
        console.error('Error sending audio data:', error);
      }
      await new Promise((resolve) => setTimeout(resolve, 250)); // Send every 250ms
    }
    console.log(
      `Finished sending audio data. Total chunks sent: ${chunkCounter}`,
    );
  };

  const startSilenceDetection = () => {
    silenceTimerRef.current = setInterval(() => {
      if (
        isRecording &&
        Date.now() - lastTranscriptTimeRef.current >= SILENCE_THRESHOLD
      ) {
        console.log('Stopping recording due to silence');
        stopRecording();
      }
    }, SILENCE_CHECK_INTERVAL);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <ScrollView style={{ flex: 1 }}>
        <TextInput
          multiline
          value={
            transcript +
            (interimTranscript ? ' **' + interimTranscript + '**' : '')
          }
          onChangeText={setTranscript}
          style={{
            flex: 1,
            minHeight: 200,
            borderColor: 'gray',
            borderWidth: 1,
            padding: 10,
          }}
        />
      </ScrollView>
      <TouchableOpacity
        onPress={toggleRecording}
        style={{
          backgroundColor: isRecording ? 'red' : 'blue',
          padding: 15,
          borderRadius: 5,
          marginTop: 20,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white' }}>
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SpeechScreen;
