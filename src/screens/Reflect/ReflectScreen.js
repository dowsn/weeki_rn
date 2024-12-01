import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import ProfileHeader from 'src/components/common/ProfileHeader';
import NormalButton from '../../components/buttons/NormalButton';
import FlexSpacer from '../../components/common/FlexSpacer';
import LoadingAnimation from '../../components/common/LoadingAnimation';
import MainTitle from '../../components/common/MainTitle';
import CustomSafeView from '../../components/layouts/CustomSafeArea';
import TopicGrid from '../../components/layouts/TopicGrid';
import { useTopics } from '../../hooks/useTopics';
import { useUserContext } from '../../hooks/useUserContext';
import { createStyles } from '../../styles';
import { showAlert } from '../../utils/alert';

const ReflectScreen = ({ navigation }) => {
  const { user, setUser, theme } = useUserContext();
  const [topics, setTopics] = useState([]);
  // const styles = createStyles(theme);

  const { getTopics, isLoading, error } = useTopics();

  useEffect(() => {
    console.log(user);
  }, []);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await getTopics(user.userId);
        if (response.error) {
          showAlert('Error:', response.message);
        } else {
          console.log(response.content);
          setTopics(response.content);
          setUser({ ...user, topics: response.content });
        }
      } catch (error) {
        console.log('Error fetching topics', error.message || 'An unexpected error occurred');
      }
    };

    fetchTopics();
  }, []);

  const handleChatButtonPress = () => {
    if (user.topics.length === 0) {
      showAlert('No topics created', 'Please create at least one topic to continue');
      return;
    }
    navigation.navigate('Chat');
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    chatButton: {
      position: 'absolute',
      bottom: 20,
      alignSelf: 'center',
      padding: 40, // Increased padding to make the button much bigger
      backgroundColor: theme.colors.green, // Added background color to make the button green
      borderRadius: 90, // Increased border radius to maintain circular shape with bigger size
    },
  });

  return isLoading ? (
    <LoadingAnimation />
  ) : (
    <CustomSafeView scrollable >

      {/* <MainTitle title="Let's reflect about" /> */}
      {/* <FlexSpacer /> */}
      <TopicGrid data={topics} navigation={navigation} />
      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => {handleChatButtonPress()}}
      >

      </TouchableOpacity>
    </CustomSafeView>
  );
};



export default ReflectScreen;