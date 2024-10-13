import React from 'react';
import { Text, View } from 'react-native';

const EmptyList = ({ itemName = "Notes" }) => {

  // how to do itemName in list
  return (
    <View>
      <Text>There are no {itemName} yet.</Text>
    </View>
  );
};

export default EmptyList;
