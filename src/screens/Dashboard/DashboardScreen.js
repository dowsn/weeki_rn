import { set } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { AppState, StyleSheet, Text } from 'react-native';
import YouButton from 'src/components/buttons/YouButton';
import ProfileHeader from 'src/components/common/ProfileHeader';
import CustomText from 'src/components/textboxes/CustomText';
import { useDashboard } from 'src/hooks/useDashboard';
import ChatButton from '../../components/buttons/ChatButton';
import NormalButton from '../../components/buttons/NormalButton';
import FlexSpacer from '../../components/common/FlexSpacer';
import MainTitle from '../../components/common/MainTitle';
import WeekiLoading from '../../components/common/WeekiLoading';
import CustomSafeView from '../../components/layouts/CustomSafeArea';
import TopicGrid from '../../components/layouts/TopicGrid';
import { useTopicsAndChatSession } from '../../hooks/useTopics';
import { useUserContext } from '../../hooks/useUserContext';
import { showAlert } from '../../utils/alert';

const DashboardScreen = ({ navigation }) => {
  const { user, setUser, theme } = useUserContext();
  const [chatSession, setChatSession] = useState(null);
  const [appState, setAppState] = useState(AppState.currentState);
  const [tokens, setTokens] = useState(0);
  const [nextDate, setNextDate] = useState("");
  const [isAlreadySession, setIsAlreadySession] = useState(false);
  const [hasExpiredSession, setHasExpiredSession] = useState(false);

  const { getDashboard, isLoading, error } = useDashboard();

  const fetchTopics = async () => {
    try {
      const response = await getDashboard();
      if (response.error) {
        showAlert('Weeki', response.message);
      } else {
        let receivedTopics = response.content.topics;
        setChatSession(response.content.chat_session);
        setTokens(response.content.tokens);
        setNextDate(response.content.next_date);
        setIsAlreadySession(response.content.is_already_session);
        setHasExpiredSession(response.content.has_expired_session);
      }
    } catch (error) {
      console.log(
        'Error fetching topics',
        error.message || 'An unexpected error occurred',
      );
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App has come to the foreground - fetching topics');
        fetchTopics();
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState]);

  // Handle navigation focus (still useful for in-app navigation)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchTopics();
    });

    return unsubscribe;
  }, [navigation]);

  // Initial fetch
  useEffect(() => {
    fetchTopics();
  }, []);

  return isLoading ? (
    <WeekiLoading />
  ) : (
    <CustomSafeView scrollable>
      <ProfileHeader
        navigation={navigation}
        hasExpiredSession={hasExpiredSession}
      />
      <YouButton
        navigation={navigation}
        username={user.username}
        tokens={tokens}
        next_date={nextDate}
        hasExpiredSession={hasExpiredSession}
      />
      <ChatButton
        chatSession={chatSession}
        next_date={nextDate}
        navigation={navigation}
        isAlreadySession={isAlreadySession}
      />
    </CustomSafeView>
  );
};

export default DashboardScreen;
