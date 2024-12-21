import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useChatSession } from '../../hooks/useChatSession';
import { useUserContext } from '../../hooks/useUserContext';
import { showAlert } from '../../utils/alert';
import CustomDatePickerModal from '../common/CustomDatePickerModal';

const ChatButton = ({ chatSession, navigation }) => {
  const { user, theme } = useUserContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [isToday, setIsToday] = useState(false);
  const { create, cancel, reschedule } = useChatSession();

  useEffect(() => {
    if (chatSession && chatSession.date) {
      const sessionDate = new Date(chatSession.date);
      const today = new Date();
      setIsToday(
        sessionDate.getFullYear() === today.getFullYear() &&
          sessionDate.getMonth() === today.getMonth() &&
          sessionDate.getDate() === today.getDate(),
      );
    }
  }, [chatSession]);

  const handleSave = async () => {
    await create(user.userId, date);
    setModalVisible(false);
    navigation.replace('Reflect');
  };

  const handleCancel = async () => {
    await cancel(chatSession.id);
    setModalVisible(false);
    navigation.replace('Reflect');
  };

  const handleReschedule = async () => {
    await reschedule(user.userId, chatSession.id, date);
    setModalVisible(false);
    navigation.replace('Reflect');
  };

  const handleChatButtonPress = () => {
    if (user.topics.length === 0) {
      showAlert(
        'No topics created',
        'Please create at least one topic to continue',
      );
      return;
    }
    setModalVisible(true);
  };

  const styles = StyleSheet.create({
    chatButtonContainer: {
      position: 'absolute',
      bottom: 20,
      alignSelf: 'center',
    },
    chatButton: {
      width: 100,
      height: 100,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.violet_light,
      borderRadius: 200,
    },
    buttonText: {
      color: theme.colors.violet_darkest,
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: theme.fontSizes.medium,
    },
    smallButtonText: {
      color: theme.colors.violet_darkest,
      textAlign: 'center',
      fontSize: theme.fontSizes.small,
    },
  });

  const getButtonText = () => {
    if (!chatSession || Object.keys(chatSession).length === 0) {
      return 'Some\nDay';
    } else if (!isToday) {
      return 'Set';
    } else {
      return 'Now';
    }
  };

  const getSmallButtonText = () => {
    if (!chatSession || Object.keys(chatSession).length === 0) {
      return false;
    } else if (isToday) {
      return chatSession.time_left + ' min';
    } else {
      const sessionDate = new Date(chatSession.date);
      const formattedDate = `${sessionDate.getDate()}.${sessionDate.getMonth() + 1}.`;
      return formattedDate;
    }
  };

  return (
    <View style={styles.chatButtonContainer}>
      <TouchableOpacity
        style={styles.chatButton}
        onPress={handleChatButtonPress}
      >
        <Text style={styles.buttonText}>{getButtonText()}</Text>
        {getSmallButtonText() && (
          <Text style={styles.smallButtonText}>{getSmallButtonText()}</Text>
        )}
      </TouchableOpacity>

      <CustomDatePickerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        date={date}
        onDateChange={setDate}
        onSave={handleSave}
        chatSession={chatSession}
        onCancel={handleCancel}
        onReschedule={handleReschedule}
        onOpenSession={() => {
          setModalVisible(false);
          navigation.navigate('Chat', {
            chat_session_id: chatSession.id,
          });
        }}
        isToday={isToday}
      />
    </View>
  );
};

export default ChatButton;
