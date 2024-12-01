import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomSafeView from 'src/components/layouts/CustomSafeArea';

const TopicReflectionView = ({ route }) => {
  // Your code here
    const { topicId } = route.params;

  return (
    <CustomSafeView scrollable>
      <Text>Topic Reflection View</Text>
      <Text>{topicId}</Text>
    </CustomSafeView>
  );
};

export default TopicReflectionView;
