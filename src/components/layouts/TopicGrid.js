import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useUserContext } from 'src/hooks/useUserContext';
import TopicBox from '../textboxes/TopicBox';
import TopicEmpty from '../textboxes/TopicEmpty';

const TopicGrid = ({ data, navigation }) => {
  const { theme } = useUserContext();

  const screenWidth = Dimensions.get('window').width;
  const gap = theme.spacing.small; // Gap between boxes
  const boxWidth = (screenWidth - theme.spacing.small * 2 - gap) / 2; // Calculate width
  const boxHeight = boxWidth * 0.5; // Make height 50% of width - adjust this ratio as needed

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
      width: boxWidth,
      height: boxHeight,
      marginBottom: gap,
    },
  });

  const filledData = [...data];

  return (
    <View style={styles.container}>
      <View style={styles.gridContainer}>
        {filledData.map((topic) => (
          <View key={topic.id} style={styles.boxWrapper}>
            {topic.isEmpty ? (
              <TopicEmpty
                width={boxWidth}
                height={boxHeight}
                navigation={navigation}
              />
            ) : (
              <TopicBox
                id={topic.id}
                title={topic.name}
                text={topic.description}
                navigation={navigation}
                width={boxWidth}
                height={boxHeight}
              />
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

export default TopicGrid;
