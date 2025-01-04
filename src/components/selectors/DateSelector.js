import { format } from 'date-fns'; // Assuming you use date-fns for date formatting
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomSafeView from 'src/components/layouts/CustomSafeArea';

const DateSelector = ({ navigation, route }) => {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const selectedId = route.params?.selectedId;

  const { filter } = useTopicsAndChatSession();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await filter(selectedId);
        if (!response.error && response.data?.filter) {
          setSessions(response.data.filter);
        } else {
          showAlert('Weeki:', response.message || 'Failed to load sessions');
        }
      } catch (error) {
        showAlert('Weeki:', 'Failed to load sessions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const handleSessionSelect = (sessionId) => {
    route.params?.onSelect?.(sessionId);
    navigation.goBack();
  };

  const renderSession = ({ item }) => {
    const isSelected = item.id === selectedId;

    return (
      <TouchableOpacity
        onPress={() => handleSessionSelect(item.id)}
        style={[styles.sessionItem, isSelected && styles.selectedSession]}
      >
        <View style={styles.sessionContent}>
          <Text style={[styles.sessionDate, isSelected && styles.selectedText]}>
            {format(new Date(item.created_at), 'MMM dd, yyyy HH:mm')}
          </Text>
          {item.title && (
            <Text
              style={[styles.sessionTitle, isSelected && styles.selectedText]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
          )}
        </View>
        {isSelected && (
          <View style={styles.selectedIndicator}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <CustomSafeView>
      <View style={styles.header}>
        <Text style={styles.title}>Select Chat Session</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.cancelButton}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={sessions}
          renderItem={renderSession}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={true}
        />
      )}
    </CustomSafeView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButton: {
    padding: 8,
  },
  cancelText: {
    color: '#007AFF',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  sessionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
  },
  sessionContent: {
    flex: 1,
  },
  selectedSession: {
    backgroundColor: '#007AFF',
  },
  sessionDate: {
    fontSize: 16,
    marginBottom: 4,
  },
  sessionTitle: {
    fontSize: 14,
    color: '#666',
  },
  selectedText: {
    color: '#fff',
  },
  selectedIndicator: {
    marginLeft: 12,
  },
  checkmark: {
    color: '#fff',
    fontSize: 18,
  },
});

export default DateSelector;
