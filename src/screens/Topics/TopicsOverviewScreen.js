import React, { useEffect, useState } from 'react';
import {
  AppState,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import TextLink from 'src/components/buttons/TextLink';
import YouButton from 'src/components/buttons/YouButton';
import ProfileHeader from 'src/components/common/ProfileHeader';
import CustomText from 'src/components/textboxes/CustomText';
import CustomTitle from 'src/components/textboxes/CustomTitle';
import ChatButton from '../../components/buttons/ChatButton';
import NormalButton from '../../components/buttons/NormalButton';
import CharacterHeader from '../../components/common/CharacterHeader';
import FlexSpacer from '../../components/common/FlexSpacer';
import MainTitle from '../../components/common/MainTitle';
import WeekiLoading from '../../components/common/WeekiLoading';
import CustomSafeView from '../../components/layouts/CustomSafeArea';
import TopicGrid from '../../components/layouts/TopicGrid';
import { useTopics } from '../../hooks/useTopics';
import { useUserContext } from '../../hooks/useUserContext';
import { showAlert } from '../../utils/alert';

const TopicsOverviewScreen = ({ navigation }) => {
  const { user, setUser, theme } = useUserContext();
  const [topics, setTopics] = useState([]);
  const [oldTopics, setOldTopics] = useState([]);
  const [character, setCharacter] = useState('');

  const { getTopics, isLoading, error } = useTopics();

  const fetchTopics = async () => {
    try {
      const response = await getTopics();
      if (response.error) {
        showAlert('Weeki', response.message);
      } else {
        console.log(response.content);
        let receivedTopics = response.content.topics;
        let receivedOldTopics = response.content.old_topics;
        setTopics(receivedTopics);
        setOldTopics(receivedOldTopics);
        setCharacter(response.content.character);
        setUser({ ...user, topics: receivedTopics });
      }
    } catch (error) {
      console.log(
        'Error fetching topics',
        error.message || 'An unexpected error occurred',
      );
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchTopics();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.violet_darkest,
    },
    scrollView: {
      flex: 1,
    },
    contentContainer: {
      flexGrow: 1,
      paddingHorizontal: theme.spacing.small,
      paddingBottom: 80, // Add space for the TextLink
      paddingTop: theme.spacing.small,
    },
  });

  return isLoading ? (
    <WeekiLoading />
  ) : (
    <CustomSafeView>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <CharacterHeader
          navigation={navigation}
          text={character}
          title={user.username}
        />

        <TopicGrid data={topics} navigation={navigation} />

        {oldTopics.length > 0 && (
          <>
            <CustomTitle user="true">Inactive</CustomTitle>
            <TopicGrid data={oldTopics} navigation={navigation} />
          </>
        )}
        <FlexSpacer />
      </ScrollView>
      <TextLink
        text="Focusboard"
          onPress={() => {
            navigation.goBack(); // This will go back to Dashboard
          }}
        color={theme.colors.violet_light}
      />
    </CustomSafeView>
  );
};

export default TopicsOverviewScreen;
