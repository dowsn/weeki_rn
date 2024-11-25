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

const ReflectScreen = ({ navigation }) => {
  const { user, setUser, theme } = useUserContext();
  const [topics, setTopics] = useState([]);
  const styles = createStyles(theme);

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
        }
      } catch (error) {
        console.log('Error fetching topics', error.message || 'An unexpected error occurred');
      }
    };

    fetchTopics();
  }, []);

  return isLoading ? (
    <LoadingAnimation />
  ) : (
    <CustomSafeView scrollable>
      {/* <MainTitle title="Let's reflect about" /> */}
      {/* <FlexSpacer /> */}
      <TopicGrid data={topics} navigation={navigation} />
    </CustomSafeView>
  );
};

export default ReflectScreen;