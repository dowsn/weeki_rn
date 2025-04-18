import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Text from 'src/components/common/Text';
import { useUserContext } from 'src/hooks/useUserContext';

const TopicConfirmator = ({ onConfirm, onSkip }) => {
  const { theme } = useUserContext();

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
      color: theme.colors.yellow_light,
      fontSize: theme.fontSizes.medium,
    },
    linkText: {
      color: theme.colors.yellow_light,
      fontSize: theme.fontSizes.medium,
      textDecorationLine: 'underline',
    },
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
  });

  return (
    <View style={styles.messageContainer}>
      <View style={styles.messageBubble}>
        <View style={styles.row}>
          <Text style={styles.messageText}>I am deciding to </Text>
          <TouchableOpacity onPress={onConfirm}>
            <Text style={styles.linkText}>confirm</Text>
          </TouchableOpacity>
          <Text style={styles.messageText}> or </Text>
          <TouchableOpacity onPress={onSkip}>
            <Text style={styles.linkText}>skip</Text>
          </TouchableOpacity>
          <Text style={styles.messageText}>
            this topic or talk about it further:
          </Text>
        </View>
      </View>
    </View>
  );
};

export default TopicConfirmator;
