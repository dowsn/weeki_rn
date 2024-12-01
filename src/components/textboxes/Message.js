import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useUserContext } from 'src/hooks/useUserContext';

const Message = ({ id, sender, date_created, text, profilePicture, followup = false }) => {

  const { user, theme } = useUserContext();

  const styles = StyleSheet.create({
    messageContainer: {
      width: '100%',
      marginBottom: theme.spacing.small,
      alignItems: 'center',
    },
    profilePictureContainer: {
      width: '100%',
      alignItems: 'center',
      marginBottom: 8,
    },
    profilePicture: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: '#4899F7', // Blue color from your example
    },
    messageBubble: {
      width: '100%',
      padding: theme.spacing.medium,
      borderRadius: theme.borderRadii.large,
      backgroundColor: sender === 'assistant' ? theme.colors.mr_week : theme.colors.me,
    },
    messageText: {
      color: 'black',
      fontSize: theme.fontSizes.medium,
    },
  });

  return (
    <View key={id || date_created} style={styles.messageContainer}>
      {!followup && (
      <View style={styles.profilePictureContainer}>
        <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
      </View>
      )}
      <View style={styles.messageBubble}>
        <Text style={styles.messageText}>{text}</Text>
      </View>
    </View>
  );
};

export default Message;
