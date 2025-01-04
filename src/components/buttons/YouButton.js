import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'src/components/common/Text';
import { useChatSession } from '../../hooks/useChatSession';
import { useUserContext } from '../../hooks/useUserContext';
import { showAlert } from '../../utils/alert';

const YouButton = ({
  navigation,
  username,
  tokens = 4,
  next_date = 'unavailable',
  hasExpiredSession = true,
}) => {
  const { user, theme } = useUserContext();

  const handleYouButtonPress = useCallback(() => {
    if (!hasExpiredSession) {
      showAlert('Weeki', 'Here you will be able to look at how I see your character and your topics. Click on me to schedule our first session.');
      return;
    }
    navigation.navigate('Topics');
  });

  const styles = StyleSheet.create({
    chatButtonContainer: {
      position: 'absolute',
      bottom: 200,
      alignSelf: 'center',
      zIndex: 1, // Ensure button stays above other elements
    },
    chatButton: {
      width: 150,
      height: 150,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.yellow_light,
      borderRadius: 150, // Half of width/height for perfect circle
      elevation: 4, // Android shadow
      shadowColor: '#000', // iOS shadow
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    buttonText: {
      color: theme.colors.violet_darkest,
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: theme.fontSizes.large,
    },
    smallButtonText: {
      color: theme.colors.violet_darkest,
      textAlign: 'center',
      fontSize: theme.fontSizes.small,
      marginTop: 4,
    },
  });

  return (
    <View style={styles.chatButtonContainer}>
      <TouchableOpacity
        style={styles.chatButton}
        onPress={handleYouButtonPress}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>{username}</Text>
        {next_date != 'Subscribe' && (
          <Text style={styles.smallButtonText}>
            {tokens === 0
              ? `New sessions ${next_date}`
              : `${tokens} session${tokens > 1 ? 's' : ''}`}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default YouButton;
