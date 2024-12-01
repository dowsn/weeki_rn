import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useUserContext } from 'src/hooks/useUserContext';
import TopicBox from '../textboxes/TopicBox';
import TopicEmpty from '../textboxes/TopicEmpty';

const TopicGrid = ({ data, navigation }) => {

  const { theme } = useUserContext();

  const screenWidth = Dimensions.get('window').width;
  const gap = theme.spacing.small; // Gap between boxes
  const boxSize = (screenWidth - (theme.spacing.small * 2)  - gap) / 2; // Calculate size accounting for padding and gap

  const styles = StyleSheet.create({
    container: {
      paddingTop: theme.spacing.small,
    },
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    boxWrapper: {
      width: boxSize,
      height: boxSize,
      marginBottom: gap,
    },
  });

  // Fill up with EmptyTopic components if less than 4 topics
  const filledData = [...data];
  while (filledData.length < 4) {
    filledData.push({ id: `empty-${filledData.length}`, isEmpty: true });
  }

  return (
    <View style={styles.container}>
      <View style={styles.gridContainer}>
        {filledData.map((topic) => (
          <View key={topic.id} style={styles.boxWrapper}>
            {topic.isEmpty ? (
              <TopicEmpty size={boxSize} navigation={navigation} />
            ) : (
              <TopicBox
                id={topic.id}
                title={topic.name}
                image={topic.image}
                navigation={navigation}
                size={boxSize}
              />
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

export default TopicGrid;
