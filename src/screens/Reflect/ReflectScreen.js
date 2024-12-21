import React, { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import ProfileHeader from 'src/components/common/ProfileHeader';
import CustomText from 'src/components/textboxes/CustomText';
import ChatButton from '../../components/buttons/ChatButton';
import NormalButton from '../../components/buttons/NormalButton';
import FlexSpacer from '../../components/common/FlexSpacer';
import MainTitle from '../../components/common/MainTitle';
import WeekiLoading from '../../components/common/WeekiLoading';
import CustomSafeView from '../../components/layouts/CustomSafeArea';
import TopicGrid from '../../components/layouts/TopicGrid';
import { useTopicsAndChatSession } from '../../hooks/useTopicsAndChatSession';
import { useUserContext } from '../../hooks/useUserContext';
import { showAlert } from '../../utils/alert';

const ReflectScreen = ({ navigation }) => {
  const { user, setUser, theme } = useUserContext();
  const [topics, setTopics] = useState([]);
  const [chatSession, setChatSession] = useState(null);
  const { getTopicsAndChatSession, isLoading, error } =
    useTopicsAndChatSession();

  const fetchTopics = async () => {
    try {
      const response = await getTopicsAndChatSession(user.userId);
      if (response.error) {
        showAlert('Error:', response.message);
      } else {
        console.log(response.content);
        let receivedTopics = response.content.topics;
        setTopics(receivedTopics);
        setChatSession(response.content.chat_session);
        setUser({ ...user, topics: receivedTopics });
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
    fetchTopics();
  }, []);

  // Add navigation focus listener to reload data when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchTopics();
    });

    // Cleanup listener on component unmount
    return unsubscribe;
  }, [navigation]);

  return isLoading ? (
    <WeekiLoading />
  ) : (
    <CustomSafeView scrollable>
      <CustomText>about{'\n'}personal topics</CustomText>

      <TopicGrid data={topics} navigation={navigation} />
      <ChatButton chatSession={chatSession} navigation={navigation} />
      <CustomText user={false}>
        in{'\n'}focused session{'\n'}starting
      </CustomText>
    </CustomSafeView>
  );
};

export default ReflectScreen;
