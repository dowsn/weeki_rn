import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Text from 'src/components/common/Text';
import { useUserContext } from 'src/hooks/useUserContext';

const TopicBox = ({ id, title, text, width, height, navigation }) => {
  const { theme } = useUserContext();

  const styles = StyleSheet.create({
    container: {
      width: width,
      height: height,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: theme.borderRadii.large * 3,
      overflow: 'hidden',
      position: 'relative',
      borderWidth: 1,
      borderColor: theme.colors.yellow_light,
    },
    textContainer: {
      backgroundColor: theme.colors.violet_darkest,
      padding: theme.spacing.small,
      width: '100%',
    },
    text: {
      color: theme.colors.yellow_light,
      textAlign: 'center',
      fontSize: theme.fontSizes.medium,
    },
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        navigation.navigate('TopicDetail', { text, title, navigation })
      }
    >
      <View style={styles.textContainer}>
        <Text style={styles.text} numberOfLines={2}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default TopicBox;
