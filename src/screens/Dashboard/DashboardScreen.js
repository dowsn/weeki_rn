// File: src/screens/Dashboard/DashboardScreen.js
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
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

const DashboardScreen = ({ navigation }) => {
  const { user, setUser, theme } = useUserContext();
  const [topics, setTopics] = useState([]);
  const styles = createStyles(theme);

  const { getTopics, isLoading, error } = useTopics();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await getTopics(user.userId);
        if (response.error) {
          showAlert('Error:', response.message);
        } else {
          setTopics(response.content);
        }
      } catch (error) {
        console.log('Error fetching topics', error.message || 'An unexpected error occurred');
      }
    };

    fetchTopics();
  }, []);

  const logoutHandler = async () => {
    setUser({ userId: 0 });
  };

  return isLoading ? (
    <LoadingAnimation />
  ) : (
    <CustomSafeView scrollable>
      <MainTitle title={`Welcome ${user.username}`} />
      <FlexSpacer />
      <TopicGrid data={topics} navigation={navigation} />
      <NormalButton
        text="Edit Profile"
        onPress={() => navigation.navigate('EditProfile')}
      />
      <NormalButton text="Logout" onPress={logoutHandler} />

    </CustomSafeView>
  );
};

export default DashboardScreen;