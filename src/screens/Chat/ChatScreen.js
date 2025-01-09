import { useNavigation } from '@react-navigation/native';
import { Asset } from 'expo-asset';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import TextLink from 'src/components/buttons/TextLink';
import CustomDatePickerModal from 'src/components/common/CustomDatePickerModal';
import LoadingAnimation from 'src/components/common/LoadingAnimation';
import { Text } from 'src/components/common/Text';
import Message from 'src/components/textboxes/Message';
import { www } from 'src/constants/constants';
import { useAgentChat } from 'src/hooks/useChatAgent';
import { useNote } from 'src/hooks/useNote';
import { useUserContext } from 'src/hooks/useUserContext';
import { showAlert } from 'src/utils/alert';
import { useApiCall } from 'src/utils/hook';
import WeekiLoading from '../../components/common/WeekiLoading';

const ChatScreen = (router) => {
  const { theme, user } = useUserContext();
  const { chat_session_id } = router.route.params;
  const navigation = useNavigation();

  // Add state for image loading
  const [imageError, setImageError] = useState(false);

  // Other state declarations...
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Preload the icon image
  useEffect(() => {
    Asset.fromModule(require('assets/icon.png'))
      .downloadAsync()
      .catch((error) => {
        console.error('Failed to preload icon:', error);
        setImageError(true);
      });
  }, []);

  // Date picker handlers
  const handleModal = () => {
    setIsDatePickerVisible(true);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleCloseDatePicker = () => {
    setIsDatePickerVisible(false);
  };

  const handleSaveDate = async () => {
    await handleReschedule();
    setIsDatePickerVisible(false);
    navigation.replace('Dashboard');
  };

  // Reschedule functionality
  const handleReschedule = async () => {
    try {
      const response = await apiCalls.reschedule({
        chatSessionId: chat_session_id,
        date: selectedDate,
      });

      console.log('Chat session rescheduled:', response);

      if (response.error !== true) {
        return response.message;
      }

      throw new Error('Failed to reschedule chat session');
    } catch (error) {
      console.error('Error rescheduling chat session:', error);
      showAlert('Error', 'Failed to reschedule chat session');
      throw error;
    }
  };

  const handleStreamedResponse = useCallback((data) => {
    if (data.type === 'connection_status' && data.messages) {
      setMessages(
        data.messages.map((msg) => ({
          id: msg.id,
          text: msg.content,
          sender: msg.role === 'assistant' ? 'assistant' : 'user',
          date_created: msg.date_created,
        })),
      );
      setIsInitialized(true);
    } else if (typeof data === 'string') {
      setMessages((prev) => {
        const isSpecialMessage = data.startsWith('***');

        if (
          !prev.length ||
          prev[prev.length - 1].sender !== 'assistant' ||
          isSpecialMessage
        ) {
          return [
            ...prev,
            {
              id: Date.now().toString(),
              sender: 'assistant',
              text: data,
              date_created: new Date().toISOString(),
            },
          ];
        }

        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          text: updated[updated.length - 1].text + data,
        };
        return updated;
      });
    }
  }, []);

  const { requestResponse, sendUserMessage, sendCloseSignal, isConnected } =
    useAgentChat(handleStreamedResponse, chat_session_id);

  const handleClosingSignal = useCallback(() => {
    sendCloseSignal();
    setIsDatePickerVisible(false);
  }, [sendCloseSignal]);

  const handleKeyPress = ({ nativeEvent }) => {
    if (nativeEvent.key === 'Enter' && !nativeEvent.shiftKey) {
      handleSubmitEditing();
      return true; // Prevents default enter behavior
    }
    return false; // Allows the enter key to create a new line
  };

  const handleAddMessage = () => {
    if (text.trim()) {
      const isFollowUp =
        messages.length > 0 && messages[messages.length - 1].sender === 'user';

      const newMessage = {
        id: Date.now().toString(),
        text: text.trim(),
        sender: 'user',
        date_created: new Date().toISOString(),
      };

      sendUserMessage(text.trim());

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setText('');

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleSubmitEditing = () => {
    if (text.trim()) {
      handleAddMessage();
    }
  };

  const handleMrWeekResponse = () => {
    if (messages[messages.length - 1]?.sender === 'assistant') {
      return;
    }

    // Get consecutive user messages from bottom until we hit an assistant message
    const userMessages = [];
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
      if (message.sender === 'assistant') {
        // can't respond two times in row
        break;
      }
      if (message.sender === 'user') {
        userMessages.unshift(message.text);
      }
    }

    const query = userMessages.join('\n');

    if (query.trim() && isConnected) {
      requestResponse(query);
    } else if (!isConnected) {
      showAlert('Error', 'Not connected to chat service');
    }
  };

  const mrWeekPicture = require('assets/icon.png');

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (event) => {
        setKeyboardHeight(event.endCoordinates.height);
        setTimeout(scrollToBottom, 100);
      },
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
        setTimeout(scrollToBottom, 100);
      },
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBottomPadding = () => {
    const TAB_BAR_HEIGHT = 60;
    const INPUT_CONTAINER_HEIGHT = 56;
    const bottomHeight = TAB_BAR_HEIGHT + INPUT_CONTAINER_HEIGHT;
    // Only add small additional padding when keyboard is shown
    return keyboardHeight > 0 ? 20 : bottomHeight;
  };

  const isIPhoneWithNotch = () => {
    const dim = Dimensions.get('window');
    return (
      Platform.OS === 'ios' &&
      !Platform.isPad &&
      !Platform.isTVOS &&
      (dim.height > 800 || dim.width > 800)
    );
  };

  const getKeyboardOffset = () => {
    if (Platform.OS === 'ios') {
      return isIPhoneWithNotch() ? 88 : 60;
    }
    return 0;
  };

  const styles = StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: theme.colors.violet_darkest, // Match keyboard color
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.violet_darkest,
    },
    messagesContainer: {
      flex: 1,
    },
    contentContainer: {
      flexGrow: 1,
      padding: theme.spacing.medium,
      paddingBottom: getBottomPadding(),
      paddingTop: theme.spacing.large + 20, // Increased padding
    },
    floatingControls: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1,
      paddingHorizontal: 20,
      paddingTop: Platform.OS === 'ios' ? 70 : 20,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      backgroundColor: 'transparent',
    },
    circleButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(10, 33, 64, 0.6)',
    },
    inputSection: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.violet_darkest,
      borderTopWidth: 1,
      borderTopColor: 'rgba(0, 0, 0, 0.1)',
      paddingBottom: Platform.OS === 'ios' ? 0 : 16, // Increased padding
    },
    inputContainer: {
      paddingHorizontal: theme.spacing.medium,
      paddingVertical: 8,
      backgroundColor: theme.colors.violet_darkest,
      paddingBottom: 20,
    },
    input: {
      backgroundColor: theme.colors.yellow_light,
      borderRadius: theme.borderRadii.large,
      paddingHorizontal: theme.spacing.medium,
      paddingVertical: 10, // Adjusted to center text
      fontSize: 16,
      maxHeight: 120,
      fontColor: theme.colors.violet_darkest,
      minHeight: 40,
      color: theme.colors.violet_darkest,
      textAlignVertical: 'center', // Added to center the cursor/text
    },
    mrWeekButton: {
      borderTopColor: 'yellow',
      position: 'absolute',
      right: 16,
      top: -48,
      zIndex: 1,
    },
  });

  return !isInitialized ? (
    <WeekiLoading />
  ) : (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      {/* Rest of your existing JSX */}

      {isConnected ? (
        <View style={styles.inputSection}>
          <View style={styles.inputContainer}>
            <Pressable
              style={styles.mrWeekButton}
              onPress={handleMrWeekResponse}
              disabled={isLoading}
              onLongPress={handleModal}
            >
              {!imageError && (
                <Image
                  source={require('assets/icon.png')}
                  style={{ width: 38, height: 38 }}
                  onError={(error) => {
                    console.error(
                      'Image loading error:',
                      error.nativeEvent.error,
                    );
                    setImageError(true);
                  }}
                />
              )}
            </Pressable>

            <TextInput
              ref={inputRef}
              style={styles.input}
              value={text}
              onChangeText={setText}
              placeholder="Type a message..."
              placeholderTextColor={theme.colors.gray}
              multiline={true}
              onKeyPress={handleKeyPress}
              onSubmitEditing={handleSubmitEditing}
              returnKeyType="send"
              submitBehavior="blurAndSubmit"
            />
          </View>
        </View>
      ) : (
        <TextLink
          text="Dashboard"
          onPress={() => navigation.replace('Dashboard')}
          colorType="yellow"
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;
