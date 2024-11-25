import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useUserContext } from 'src/hooks/useUserContext';
import TopicBox from '../textboxes/TopicBox';

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

  return (
    <View style={styles.container}>
      <View style={styles.gridContainer}>
        {data.map((topic) => (
          <View key={topic.id} style={styles.boxWrapper}>
            <TopicBox
              id={topic.id}
              title={topic.name}
              image={topic.image}
              navigation={navigation}
              size={boxSize}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

export default TopicGrid;
