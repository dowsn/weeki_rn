import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { www } from 'src/constants/constants';
import { useUserContext } from 'src/hooks/useUserContext';

const TopicBox = ({ id, title, image, size, navigation }) => {
  const { theme } = useUserContext();

  const imagePath = image ? www + image : null;

  console.log(imagePath);

  const styles = StyleSheet.create({
    container: {
      width: size,
      height: size,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: theme.borderRadii.large,
      overflow: 'hidden',
      position: 'relative',
    },
    image: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    textContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      padding: theme.spacing.small,
    },
    text: {
      color: theme.colors.light,
      textAlign: 'center',
      fontSize: theme.fontSizes.medium,
    },
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        navigation.navigate('TopicReflectionView', { topicId: id })
      }
    >
      <Image source={{ uri: imagePath }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.text} numberOfLines={2}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default TopicBox;
