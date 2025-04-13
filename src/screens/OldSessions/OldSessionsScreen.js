import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import ArrowNavigation from 'src/components/buttons/ArrowNavigation';
import TextLink from 'src/components/buttons/TextLink';
import CustomSafeView from 'src/components/layouts/CustomSafeArea';
import { useOldSession } from 'src/hooks/useOldSessions';
import { useUserContext } from 'src/hooks/useUserContext';
import DateButtons from 'src/navigation/DateButtons';
import { showAlert } from 'src/utils/alert';
import ChatSession from '../../components/layouts/ChatSession';

const OldSessionsScreen = ({ navigation, route }) => {
  const [chatSessionId, setChatSessionId] = useState(
    route.params?.selected_id ?? null,
  );

  const { theme, user } = useUserContext();
  const [messages, setMessages] = useState([]);
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [previousId, setPreviousId] = useState(null);
  const [nextId, setNextId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { get } = useOldSession();



  const fetchChatSession = async (selectedId = null) => {
    setIsLoading(true);
    try {
      let response = await get(selectedId);

      if (response.error) {
        showAlert('Weeki', response.message);
        return;
      }


      const {
        messages: newMessages,
        selected,
        previousId: newPrevious,
        nextId: newNext,

      } = response.content;



      console.log(response.content.selected)

      const { title: newTitle, id: newSessionId } = selected;

      setMessages(newMessages[0]);
      setTitle(newTitle);
      setSummary(response.content.selected.summary);
      setChatSessionId(newSessionId);
      setPreviousId(newPrevious);
      setDate(new Date(response.content.selected.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
      setNextId(newNext);
    } catch (error) {
      showAlert('Weeki', 'Failed to fetch chat session');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChatSession(chatSessionId);
  }, []);

  const handleNavigation = (newSessionId) => {
    fetchChatSession(newSessionId);
  };



 const handleSelect = (newSessionId) => {
   fetchChatSession(newSessionId);
 };

  const onChatPress = (text) => {
    navigation.navigate('Chat', { messages, navigation });

  }

  const onSummaryPress = (text) => {
    navigation.navigate('Summary', { text: summary, navigation, backText: 'Moments' });
  }


  return (
    <CustomSafeView scrollable>
      <DateButtons
        navigation={navigation}
        selectedId={chatSessionId}
        onSelect={handleSelect}
      />
      <ArrowNavigation
        date={date}
        previous={previousId}
        next={nextId}
        onNavigate={handleNavigation}
      />
      <ChatSession
        title={title}
        isLoading={isLoading}
        onChatPress={onChatPress}
        onSummaryPress={onSummaryPress}
      />
      <TextLink
        text="Focusboard"
        onPress={() => navigation.goBack()}
        color={theme.colors.violet_light}
      />
    </CustomSafeView>
  );
};

const styles = StyleSheet.create({
  // Add any additional styles here
});

export default OldSessionsScreen;
