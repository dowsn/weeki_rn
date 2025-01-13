import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import NormalButton from 'src/components/buttons/NormalButton';
import TextLink from 'src/components/buttons/TextLink';
import CustomSafeView from 'src/components/layouts/CustomSafeArea';
import { useOldSession } from 'src/hooks/useOldSessions';
import { useUserContext } from 'src/hooks/useUserContext';
import { showAlert } from 'src/utils/alert';

const OldSessionsSelectScreen = ({ navigation, route }) => {

  const {theme} = useUserContext();
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { selectedId, onSelect } = route.params || {};
  const { filter } = useOldSession();


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
      backgroundColor: 'yellow',
    },
    sessionContent: {
      flex: 1,
    },
    selectedSession: {
      backgroundColor: '#007AFF',
    },
    sessionDate: {
      fontSize: 16,
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
    footerPart: {
      flexDirection: 'flex-end',
    },
  });

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await filter(selectedId);

        if (!response.error && response.content?.filter) {
          console.log(response.content.filter);
          setSessions(response.content.filter);

        } else {
          showAlert('Error:', response.message || 'Failed to load sessions');
        }
      } catch (error) {

        showAlert('Error:', 'Failed to load sessions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const handleSessionSelect = (sessionId) => {
    onSelect?.(sessionId); // This will trigger the parent's fetchChatSession
  };

  const renderSession = ({ item }) => {
    const isSelected = item.id === selectedId;
    const formattedDate = format(new Date(item.date), 'MMM dd, yyyy');



    return (
      <NormalButton onPress={() => handleSessionSelect(item.id)} text={formattedDate} colorType={isSelected ? 'violet' : 'yellow'} />

    );
  };

  return (
    <CustomSafeView>


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
        />
      )}
      <TextLink style={styles.footerPart} text="Moments" onPress={() => navigation.goBack()} />
    </CustomSafeView>
  );
};



export default OldSessionsSelectScreen;
