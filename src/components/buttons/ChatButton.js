import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useUserContext } from '../../hooks/useUserContext';
import { showAlert } from '../../utils/alert';

const ChatButton = ({ chatSession, navigation }) => {

  const { user, theme } = useUserContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [isToday, setIsToday] = useState(false);

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

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  const handleSave = async () => {
    // Call useChatSession API with selected date
    await useChatSession({ userId: user.userId, date });
    setModalVisible(false);
    navigation.replace('Reflect'); // Reload the ReflectScreen
  };

  const handleChatButtonPress = () => {
    if (user.topics.length === 0) {
      showAlert(
        'No topics created',
        'Please create at least one topic to continue',
      );
      return;
    } else {
      setModalVisible(true);
    }
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
      backgroundColor: theme.colors.green,
      borderRadius: 200,
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    buttonClose: {
      backgroundColor: '#2196F3',
    },
    textStyle: {
      color: theme.colors.violet_darkest,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
    optionButton: {
      backgroundColor: '#2196F3',
      borderRadius: 20,
      padding: 10,
      margin: 10,
      elevation: 2,
    },
    optionButtonText: {
      color: theme.colors.violet_darkest,
      fontSize: theme.fontSizes.medium,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });

  const getButtonStyle = () => {
    if (!chatSession) {
      return { backgroundColor: theme.colors.violet_light };
    } else if (!isToday) {
      return { backgroundColor: theme.colors.violet_light };
    } else {
      return { backgroundColor: theme.colors.violet_light };
    }
  };

  const getButtonText = () => {
    if (!chatSession || Object.keys(chatSession).length === 0) {
      return "Some\nDay";
    } else if (!isToday) {
      return `Set`;
    } else {
      return `Now`;
    }
  };

  const getSmallButtonText = () => {
    if (!chatSession || Object.keys(chatSession).length === 0) {
      return false;
    } else {
      const sessionDate = new Date(chatSession.date);
      const formattedDate = `${sessionDate.getDate()}.${sessionDate.getMonth() + 1}.`;
      return formattedDate;
    }
  };

  return (
    <View style={styles.chatButtonContainer}>
      <TouchableOpacity
        style={[styles.chatButton, getButtonStyle()]}
        onPress={handleChatButtonPress}
      >
        <Text
          style={{
            color: theme.colors.violet_darkest,
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: theme.fontSizes.medium,
          }}
        >
          {getButtonText()}
        </Text>
        {getSmallButtonText() && (
          <Text
            style={{
              color: 'white',
              textAlign: 'center',
              fontSize: theme.fontSizes.small,
            }}
          >
            {getSmallButtonText()}
          </Text>
        )}
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {isToday ? (
              <>
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => {
                    setModalVisible(false);
                    navigation.navigate('Chat'); // some api call?
                  }}
                >
                  <Text style={styles.optionButtonText}>Open Session</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={showDatepicker}
                >
                  <Text style={styles.optionButtonText}>Reschedule</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {Platform.OS === 'android' ? (
                  <>
                    <Button onPress={showDatepicker} title="Select Date" />
                    {show && (
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode="date"
                        is24Hour={true}
                        display="default"
                        onChange={onChange}
                      />
                    )}
                  </>
                ) : (
                  // iOS with calendar view
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode="date"
                    display="inline"
                    onChange={onChange}
                    style={{ height: 340, width: 300 }}
                  />
                )}
                <Button
                  style={[styles.button, styles.buttonClose]}
                  onPress={handleSave}
                  title="Save"
                />
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ChatButton;
