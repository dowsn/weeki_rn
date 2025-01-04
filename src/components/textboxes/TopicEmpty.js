import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Text from 'src/components/common/Text';
import { useUserContext } from '../../hooks/useUserContext';

const TopicEmpty = ({ size, navigation }) => {
  const { theme } = useUserContext();

  const styles = StyleSheet.create({
    container: {
      width: size,
      height: size,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: theme.borderRadii.large,
      backgroundColor: 'yellow',
      overflow: 'hidden',
      position: 'relative',
    },
    plus: {
      fontSize: theme.fontSizes.large,
      color: 'black',
    },
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate('CreateTopic')}
    >
      <Text style={styles.plus}>+</Text>
    </TouchableOpacity>
  );
};

export default TopicEmpty;