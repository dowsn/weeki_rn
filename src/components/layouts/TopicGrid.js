import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useUserContext } from 'src/hooks/useUserContext';
import TopicBox from '../textboxes/TopicBox';

const TopicGrid = ({ data }) => {
  const { theme } = useUserContext();
  const screenWidth = Dimensions.get('window').width;
  const padding = theme.spacing.small;
  const boxSize = (screenWidth - padding * 3) / 2; // Calculate the size of each box

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      padding: padding,
    },
    boxWrapper: {
      width: boxSize,
      height: boxSize,
      marginBottom: padding,
    },
  });

  return (
    <View style={styles.container}>
      {data.map((topic) => (
        <View key={topic.id} style={styles.boxWrapper}>
          <TopicBox id={topic.id} title={topic.title} color={topic.color} />
        </View>
      ))}
    </View>
  );
};

export default TopicGrid;
