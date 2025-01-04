import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Text from 'src/components/common/Text';
import { useUserContext } from 'src/hooks/useUserContext';

const Message = ({ id, sender, date_created, text}) => {

  const { user, theme } = useUserContext();

  const styles = StyleSheet.create({
    messageContainer: {
      width: '100%',
      marginBottom: theme.spacing.small,
      alignItems: 'center',
    },

    messageBubble: {
      width: '100%',
      backgroundColor: theme.colors.violet_darkest,
    },
    messageText: {
      color: sender === 'user' ? theme.colors.yellow_light : theme.colors.violet_light,
      fontSize: theme.fontSizes.medium,
    },
  });

  return (
    <View key={id || date_created} style={styles.messageContainer}>
      <View style={styles.messageBubble}>
        <Text style={styles.messageText}>{text}</Text>
      </View>
    </View>
  );
};

export default Message;
