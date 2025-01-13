import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DebugLogger } from 'src/utils/DebugLogger';

const DebugChatScreen = ({ route }) => {
  const [isDebugVisible, setIsDebugVisible] = useState(false);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Log initial launch
    DebugLogger.log('Debug Chat Screen Mounted');

    // Try to get the chat session id
    const chat_session_id = route?.params?.chat_session_id;
    DebugLogger.log(`Chat Session ID: ${chat_session_id}`);

    // Set up error handler
    const errorHandler = (error) => {
      DebugLogger.log(`Unhandled error: ${error.message}`, 'error');
    };

    global.ErrorUtils.setGlobalHandler(errorHandler);

    return () => {
      DebugLogger.log('Debug Chat Screen Unmounted');
    };
  }, []);

  const showLogs = async () => {
    try {
      const savedLogs = await DebugLogger.getLogs();
      setLogs(savedLogs);
      setIsDebugVisible(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to load debug logs');
    }
  };

  // Test basic functionality first
  const testConnection = async () => {
    try {
      DebugLogger.log('Testing basic view rendering');
      setIsDebugVisible(true);
    } catch (error) {
      DebugLogger.log(`Test connection error: ${error.message}`, 'error');
    }
  };

  if (!isDebugVisible) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.debugButton} onPress={showLogs}>
          <Text style={styles.debugButtonText}>Show Debug Info</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.testButton} onPress={testConnection}>
          <Text style={styles.debugButtonText}>Test Connection</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setIsDebugVisible(false)}
      >
        <Text style={styles.closeButtonText}>Hide Debug</Text>
      </TouchableOpacity>

      <View style={styles.logsContainer}>
        {logs.map((log, index) => (
          <Text key={index} style={styles.logText}>
            {log}
          </Text>
        ))}
      </View>

      <TouchableOpacity
        style={styles.clearButton}
        onPress={async () => {
          await DebugLogger.clearLogs();
          setLogs([]);
        }}
      >
        <Text style={styles.buttonText}>Clear Logs</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  debugButton: {
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    marginBottom: 10,
  },
  testButton: {
    padding: 10,
    backgroundColor: '#34C759',
    borderRadius: 5,
    marginBottom: 10,
  },
  closeButton: {
    padding: 10,
    backgroundColor: '#FF3B30',
    borderRadius: 5,
    marginBottom: 10,
  },
  clearButton: {
    padding: 10,
    backgroundColor: '#FF9500',
    borderRadius: 5,
  },
  debugButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  closeButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  logsContainer: {
    flex: 1,
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  logText: {
    fontSize: 12,
    marginBottom: 5,
  },
});

export default DebugChatScreen;
