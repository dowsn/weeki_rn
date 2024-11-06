import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TopicReflectionView = ({ route }) => {
  // Your code here
    const { topicId } = route.params;


  return (
    <View>
      <Text>Topic Reflection View</Text>
      <Text>{topicId}</Text>
    </View>
  );
};

export default TopicReflectionView;
