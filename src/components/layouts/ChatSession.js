import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Text } from 'src/components/common/Text';
import { useUserContext } from '../../hooks/useUserContext';
import NormalButton from '../buttons/NormalButton';
import WeekiLoading from '../common/WeekiLoading';

const ChatSession = ({
  title = '',
  isLoading = false,
  onChatPress,
  onSummaryPress,
}) => {
  const { theme } = useUserContext();


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.violet_darkest,
    },
    titleContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      color: theme.colors.yellow_light,
      fontSize: theme.fontSizes.large,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    buttonContainer: {
      padding: theme.spacing.medium,
      paddingBottom: Platform.OS === 'ios' ? 34 : theme.spacing.medium,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        {isLoading ? (
          <WeekiLoading />
        ) : (
          <Text style={styles.title}>{title}</Text>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <NormalButton text="Chat" onPress={onChatPress} colorType='violet' />
        <NormalButton text="Summary" onPress={onSummaryPress} />
      </View>
    </View>
  );
};

export default ChatSession;
