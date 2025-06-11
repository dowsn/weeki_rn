import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useUserContext } from 'src/hooks/useUserContext';
import TopicBox from '../textboxes/TopicBox';

const TopicGrid = ({ data, navigation }) => {
  const { theme } = useUserContext();

  const styles = StyleSheet.create({
    container: {
      paddingTop: theme.spacing.small,
    },
  });

  return (
    <View style={styles.container}>
      {data.map((topic) => (
        <TopicBox
          key={topic.id}
          id={topic.id}
          title={topic.name}
          text={topic.description}
          navigation={navigation}
        />
      ))}
    </View>
  );
};

export default TopicGrid;
