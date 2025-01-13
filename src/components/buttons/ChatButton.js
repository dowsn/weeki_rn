import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'src/components/common/Text';
import { useChatSession } from '../../hooks/useChatSession';
import { useUserContext } from '../../hooks/useUserContext';
import { showAlert } from '../../utils/alert';
import CustomDatePickerModal from '../common/CustomDatePickerModal';

const ChatButton = ({
  chatSession,
  navigation,
  nextDate,
  isAlreadySession,
}) => {
  const { user, theme } = useUserContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [isToday, setIsToday] = useState(false);
  const { create, cancel, reschedule } = useChatSession();



  useEffect(() => {
    const today = new Date();


    if (isAlreadySession) {
    const nextDay = new Date(today);
    nextDay.setDate(nextDay.getDate() + 1);
    setDate(nextDay); // Pass the Date object directly
    return;
    }

    if (chatSession?.date) {

      setDate(new Date(chatSession.date));
      const sessionDate = new Date(chatSession.date);

      setIsToday(sessionDate <= today);

    }
  }, [chatSession]);

  const handleSave = useCallback(async () => {
    try {
      await create(date);
      setModalVisible(false);
      navigation.replace('Dashboard');
    } catch (error) {
      showAlert('Weeki', 'Oops, I had a problem scheduling our session, please try again later.');
    }
  }, [date, navigation, create]);

  const handleCancel = useCallback(async () => {
    try {
      await cancel(chatSession.id);
      setModalVisible(false);
      navigation.replace('Dashboard');
    } catch (error) {
      showAlert(
        'Weeki',
        'Oops, I had a problem canceling our session, please try again later.',
      );
    }
  }, [chatSession?.id, navigation, cancel]);

const handleReschedule = useCallback(
  async (selectedDate) => {
    try {
      // Use the passed date if available, otherwise use state date
      const dateToUse = selectedDate || date;
      console.log('Rescheduling with date:', dateToUse);

      // Wait for the reschedule to complete
      await reschedule(chatSession.id, dateToUse);
      console.log('Reschedule API call completed');

      // Only close modal and navigate after successful reschedule
      setModalVisible(false);

      // Add a small delay before navigation to ensure state updates
      setTimeout(() => {
        navigation.replace('Dashboard');
      }, 100);
    } catch (error) {
      console.error('Reschedule error:', error);
      showAlert(
        'Error',
        'Oops, I had a problem rescheduling our session, please try again later.',
      );
    }
  },
  [chatSession?.id, date, navigation, reschedule],
);

  const handleChatButtonPress = useCallback(() => {
    // Remove setTimeout and directly set modal visibility
    setModalVisible(true);
  }, [user.topics]);

  const styles = StyleSheet.create({
    chatButtonContainer: {
      position: 'absolute',
      bottom: 20,
      alignSelf: 'center',
      zIndex: 1, // Ensure button stays above other elements
    },
    chatButton: {
      width: 150,
      height: 150,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isToday ? theme.colors.green : theme.colors.violet_light,
      borderRadius: 150, // Half of width/height for perfect circle
    },
    buttonText: {
      color: theme.colors.violet_darkest,
      textAlign: 'center',
      fontSize: theme.fontSizes.large,
    },
    smallButtonText: {
      color: theme.colors.violet_darkest,
      textAlign: 'center',
      fontSize: theme.fontSizes.medium,
      marginTop: 4,
    },
    smallerButtonText: {
      color: theme.colors.violet_darkest,
      textAlign: 'center',
      fontSize: theme.fontSizes.small,
      marginTop: 4,
    },
  });

  const getButtonText = useCallback(() => {
    if (!chatSession || Object.keys(chatSession).length === 0) {
      return '';
    }
    if (isToday) {
      return 'Now';
    }

    const sessionDate = new Date(chatSession.date);
    return `${sessionDate.getDate()}.${sessionDate.getMonth() + 1}.`;
  }, [chatSession, isToday]);

  const getSmallButtonText = useCallback(() => {
    if (!chatSession || Object.keys(chatSession).length === 0) {
      return false;
    }
    if (isToday) {
      return `${chatSession.time_left} min`;
    }
  }, [chatSession, isToday]);

  const handleModalClose = useCallback(() => {
    setModalVisible(false);
  }, []);

  const handleSubscribe = useCallback(() => {
    console.log('Subscribe');
  });

  const handleNavigateToChat = useCallback(() => {
    setModalVisible(false);
    navigation.navigate('Chat', {
      chat_session_id: chatSession.id,
    });
  }, [navigation, chatSession?.id]);

  return (
    <View style={styles.chatButtonContainer}>
      {nextDate !== 'Subscribe' ? (
        <TouchableOpacity
          style={styles.chatButton}
          onPress={handleChatButtonPress}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Weeki</Text>
          {getButtonText() !== '' && (
            <>
              <Text style={styles.smallButtonText}>{getButtonText()}</Text>
              {getSmallButtonText() && (
                <Text style={styles.smallerButtonText}>
                  {getSmallButtonText()}
                </Text>
              )}
            </>
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.chatButton}
          onPress={handleSubscribe}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Weeki</Text>
          <Text style={styles.smallButtonText}>Subscribe</Text>
        </TouchableOpacity>
      )}

      <CustomDatePickerModal
        visible={modalVisible}
        onClose={handleModalClose}
        date={date}
        onDateChange={setDate}
        onSave={handleSave}
        chatSession={chatSession}
        onCancel={handleCancel}
        onReschedule={handleReschedule}
        onOpenSession={handleNavigateToChat}
        isToday={isToday}
        isAlreadySession={isAlreadySession}
      />
    </View>
  );
};

export default ChatButton;
