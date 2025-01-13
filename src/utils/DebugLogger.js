import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const DebugLogger = {
  async log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp} [${type}]: ${message}`;

    try {
      // Get existing logs
      const existingLogs = (await AsyncStorage.getItem('debug_logs')) || '[]';
      const logs = JSON.parse(existingLogs);

      // Add new log and keep only last 100 entries
      logs.push(logEntry);
      if (logs.length > 100) logs.shift();

      // Save back to storage
      await AsyncStorage.setItem('debug_logs', JSON.stringify(logs));
    } catch (error) {
      // If we can't log, show an alert in production
      Alert.alert('Logging Error', error.message);
    }
  },

  async getLogs() {
    try {
      const logs = await AsyncStorage.getItem('debug_logs');
      return JSON.parse(logs || '[]');
    } catch (error) {
      Alert.alert('Error Reading Logs', error.message);
      return [];
    }
  },

  async clearLogs() {
    try {
      await AsyncStorage.setItem('debug_logs', '[]');
    } catch (error) {
      Alert.alert('Error Clearing Logs', error.message);
    }
  },
};
