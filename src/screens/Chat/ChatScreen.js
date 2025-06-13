import { useNavigation } from '@react-navigation/native';
import { set } from 'date-fns';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AppState,
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
import TopicConfirmator from 'src/components/textboxes/TopicConfirmator';
import { www } from 'src/constants/constants';
import { useAgentChat } from 'src/hooks/useChatAgent';
import { useUserContext } from 'src/hooks/useUserContext';
import { showAlert } from 'src/utils/alert';
import { useApiCall } from 'src/utils/hook';
import WeekiLoading from '../../components/common/WeekiLoading';

const ChatScreen = (router) => {
  const { theme, user } = useUserContext();
  const { chat_session_id } = router.route.params;
  const navigation = useNavigation();

  const [appState, setAppState] = useState(AppState.currentState);
  const appStateRef = useRef(AppState.currentState);

  const chatSession = { chat_session_id };
  const [topicNames, setTopicNames] = useState('None');

  // Initialize the API calls hook
  const { apiCalls, error: apiError } = useApiCall({
    reschedule: { path: 'chat_sessions', method: 'PUT' },
  });

  const [showTopicOptions, setShowTopicOptions] = useState(false);
  const [isResponseLoading, setIsResponseLoading] = useState(false);

  const showTopicConfirmator = () => {
    setShowTopicOptions(true);
  };

  const hideTopicConfirmator = () => {
    setShowTopicOptions(false);
  };

  const shouldShowTopicConfirmator = (text) => {
    return (
      text &&
      typeof text === 'string' &&
      text
        .toLowerCase()
        .includes(
          'do you want to explore this topic further? do you want to save it? or do you want to leave the exploration of the topic and go on with the conversation.',
        )
    );
  };

  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = React.useRef();
  const [isEnding, setIsEnding] = useState(false);

  const inputRef = React.useRef();
  const scrollTimeoutRef = useRef(null);


  const [isInitialized, setIsInitialized] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Date picker handlers
  const handleModal = () => {
    setIsDatePickerVisible(true);
  };

  const handleDateChange = (date) => {
    console.log('handleSaveDte');

    setSelectedDate(date);
  };

  const handleCloseDatePicker = () => {
    setIsDatePickerVisible(false);
  };

  const handleSaveDate = async () => {
    console.log('handleSaveDate');
    await handleReschedule();
    setIsDatePickerVisible(false);
    navigation.replace('Dashboard');
  };

  // Reschedule functionality
  const handleReschedule = async () => {
    try {
      // Check what type of object selectedDate is
      console.log(
        'Selected date type:',
        typeof selectedDate,
        selectedDate instanceof Date ? 'Date object' : 'Not a Date',
      );

      // Use the correct date - handle the case if it's an event object
      let dateToUse;

      if (selectedDate instanceof Date) {
        // It's a proper Date object
        dateToUse = selectedDate;
      } else if (
        selectedDate &&
        typeof selectedDate === 'object' &&
        (selectedDate.nativeEvent || selectedDate._targetInst)
      ) {
        // It's an event object, use the state date instead
        console.log('Event object detected, using state date');
        dateToUse = date;
      } else {
        // Default to state date
        dateToUse = date;
      }

      // Make sure dateToUse is a valid Date
      if (!(dateToUse instanceof Date)) {
        dateToUse = new Date();
      }

      // Convert to ISO string for backend
      const formattedDate = dateToUse.toISOString().split('T')[0];
      console.log('Using formatted date:', formattedDate);

      const response = await apiCalls.reschedule({
        chatSessionId: chat_session_id,
        date: formattedDate,
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

    setIsResponseLoading(false);

    const { topics, text: responseText, type, messages: messagesData } = data;

    switch (type) {
      case 'connection_status':
        setIsInitialized(true);
        if (messagesData) {
          setMessages(
            messagesData.map((msg) => ({
              id: msg.id,
              text: msg.content,
              sender: msg.role === 'assistant' ? 'assistant' : 'user',
              date_created: msg.date_created,
            })),
          );

          setTopicNames(topics || 'None');

          const lastMessage = messagesData[messagesData.length - 1];

          console.log('Last message:', lastMessage);
          console.log('Last message content:', lastMessage.content);
          console.log('role:', lastMessage.role);
          console.log('topics:', topics);

          if (
            (shouldShowTopicConfirmator(lastMessage.content) ||
             topics === 'No current topics') &&
            lastMessage.role == 'assistant'
          ) {
            console.log('Showing topic confirmator');
            showTopicConfirmator();
          }
        }
        break;
      case 'new_message':
        // Create new message with "..." as initial content

          console.log('Adding initial loading message');
           setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: 'assistant',
            text: '...', // Start with loading dots instead of empty text
            date_created: new Date().toISOString(),
          },
        ]);

        break;
      case 'processing_end':
        // Show processing indicator - same as new_message but for end processing
        console.log('Session end processing started');
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: 'assistant',
            text: '...', // Start with loading dots
            date_created: new Date().toISOString(),
          },
        ]);
        break;
      case 'stream_complete':
          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
            if (
              shouldShowTopicConfirmator(lastMessage.text) ||
              topics === 'No current topics'
            ) {
              setTimeout(() => showTopicConfirmator(), 100);
            }
            return prev; // Return unchanged state
          });
          break;
      case 'message':
      case 'automatic_message':
      case 'topic': // Both types update message content the same way

        if (type == 'message') {
          hideTopicConfirmator();
        }
        // Process regular message content
        setTopicNames(topics);
        if (typeof responseText === 'string') {
          setMessages((prev) => {
            const updated = [...prev];
            const lastMessage = updated[updated.length - 1];

            // If the current text is "..." (loading state), replace it entirely
            // Otherwise, append to existing text
            const newText =
              lastMessage.text === '...'
                ? responseText
                : lastMessage.text + responseText;

            updated[updated.length - 1] = {
              ...lastMessage,
              text: newText,
            };
            return updated;
          });

          if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
          }

          // Immediate scroll without animation for responsiveness
          scrollViewRef.current?.scrollToEnd({ animated: false });

          // Set timeout for final smooth scroll (will be cleared if more characters come)
          scrollTimeoutRef.current = setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }, 100);

          // Check for topic confirmator
          if (type === 'topic') {
            // Updated since we need to check if the current message already contains the phrase for
            // showing topic confirmator

          }






        }
        break;
    }
  }, []);

  const {
    requestResponse,
    quitTopic,
    confirmTopic,
    sendUserMessage,
    sendCloseSignal,
    sendEndSignal,
    sendPauseSignal,
    sendResumeSignal,
    isConnected,
  } = useAgentChat(handleStreamedResponse, chat_session_id);


useEffect(() => {
  if (isDatePickerVisible && isConnected) {
    console.log('Modal opened - pausing timer');
    sendPauseSignal();
  } else if (
    !isDatePickerVisible &&
    isConnected &&
    appState === 'active' &&
    !isEnding
  ) {
    // ← Add !isEnding check
    console.log('Modal closed - resuming timer (app is active)');
    sendResumeSignal();
  }
}, [
  isDatePickerVisible,
  isConnected,
  appState,
  isEnding,
  sendPauseSignal,
  sendResumeSignal,
]);

   useEffect(() => {
     const handleAppStateChange = (nextAppState) => {
       console.log(
         'App state changed:',
         appStateRef.current,
         '->',
         nextAppState,
       );

       if (
         appStateRef.current.match(/inactive|background/) &&
         nextAppState === 'active'
       ) {
         console.log('App has come to the foreground - resuming timer');
         if (isConnected) {
           sendResumeSignal();
         }
       } else if (
         appStateRef.current === 'active' &&
         nextAppState.match(/inactive|background/)
       ) {
         console.log('App has gone to the background - pausing timer');
         if (isConnected) {
           sendPauseSignal();
         }
       }

       appStateRef.current = nextAppState;
       setAppState(nextAppState);
     };

     const subscription = AppState.addEventListener(
       'change',
       handleAppStateChange,
     );

     return () => {
       subscription?.remove();
     };
   }, [isConnected, sendPauseSignal, sendResumeSignal]);

const handleClosingSignal = useCallback(() => {
  setIsEnding(true); // ← Add this flag too
  sendCloseSignal();
  setIsDatePickerVisible(false);
}, [sendCloseSignal]);

const handleEndSignal = useCallback(() => {
  setIsEnding(true);
  sendEndSignal();
  // Don't close modal immediately - let it close after a small delay
  setTimeout(() => {
    setIsDatePickerVisible(false);
  }, 50); // Small delay to ensure flag is set
}, [sendEndSignal]);



  const handleKeyPress = ({ nativeEvent }) => {
    if (nativeEvent.key === 'Enter' && !nativeEvent.shiftKey) {
      handleSubmitEditing();
      return true; // Prevents default enter behavior
    }
    return false; // Allows the enter key to create a new line
  };

  const handleAddMessage = () => {
    if (text.trim() && !isResponseLoading) {

      hideTopicConfirmator();

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
    if (
      messages[messages.length - 1]?.sender === 'assistant' &&
      messages[messages.length - 1]?.text === '...'
    ) {
      return; // Already showing loading
    }

    // Get consecutive user messages from bottom until we hit an assistant message
    const userMessages = [];
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
      if (message.sender === 'assistant' && showTopicOptions == false) {
        // can't respond two times in row
        break;
      }
      if (message.sender === 'user') {
        userMessages.unshift(message.text);
      }
    }

    const query = userMessages.join(' '); // Combine all user messages, before \n

    if (query.trim() && isConnected) {
      hideTopicConfirmator();
      setIsResponseLoading(true);

      console.log('Adding this');

      // Add loading message that will be replaced by the response
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'assistant',
          text: '...',
          date_created: new Date().toISOString(),
        },
      ]);

      requestResponse(query);
    } else if (!isConnected) {
      showAlert('Error', 'Not connected to chat service');
    }
  };

  const mrWeekPicture = require('assets/icon.png');

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const handleConfirmTopic = useCallback(() => {
    if (
      messages[messages.length - 1]?.sender === 'assistant' &&
      messages[messages.length - 1]?.text === '...'
    ) {
      return; // Already showing loading
    }

    console.log('Adding topic');

    // Add loading indicator for confirm action
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'assistant',
        text: '...',
        date_created: new Date().toISOString(),
      },
    ]);

    // Hide the topic options
    hideTopicConfirmator();

    // Set loading state
    setIsResponseLoading(true);

    // Call the existing confirm function from the hook
    confirmTopic();

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [confirmTopic, hideTopicConfirmator]);

  const handleQuitTopic = useCallback(() => {

    if (
      messages[messages.length - 1]?.sender === 'assistant' &&
      messages[messages.length - 1]?.text === '...'
    ) {
      return; // Already showing loading
    }

    console.log('Adding quit topic');
    // Add loading indicator for quit action
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'assistant',
        text: '...',
        date_created: new Date().toISOString(),
      },
    ]);

    // Hide the topic options
    hideTopicConfirmator();

    // Set loading state
    setIsResponseLoading(true);

    // Call the existing quit function from the hook
    quitTopic();

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [quitTopic, hideTopicConfirmator]);

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
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []); // Add this useEffect at the end of your useEffects

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

    disabledInput: {
      backgroundColor: theme.colors.gray,
    },

    container: {
      flex: 1,
      backgroundColor: theme.colors.violet_darkest,
    },

    dashboardLinkContainer: {
      position: 'absolute',
      bottom: Platform.OS === 'ios' ? 40 : 30,
      width: '100%',
      alignItems: 'center',
      paddingBottom: 10,
    },

    messagesContainer: {
      flex: 1,
    },
    contentContainer: {
      flexGrow: 1,
      padding: theme.spacing.medium,
      paddingBottom: getBottomPadding() + 20, // Add extra padding at bottom
      paddingTop: Platform.OS === 'ios' ? 90 : 60, // Increased top padding
    },
    statusBarOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: Platform.OS === 'ios' ? 50 : 40,
      backgroundColor: theme.colors.violet_darkest,
      zIndex: 1,
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
      paddingBottom: Platform.OS === 'ios' ? 30 : 20, // Increased bottom padding
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
      <View style={styles.container}>
        <View style={styles.statusBarOverlay} />

        <CustomDatePickerModal
          visible={isDatePickerVisible}
          onClose={handleCloseDatePicker}
          date={selectedDate}
          chatSession={chatSession}
          onDateChange={handleDateChange}
          onSave={handleSaveDate}
          onReschedule={handleSaveDate}
          onCloseSignal={handleClosingSignal}
          onOpenSession={handleCloseDatePicker}
          onEndSignal={handleEndSignal}
          isToday={true}
          fromChatScreen={true}
          text={topicNames}
        />

        <ScrollView
         ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.contentContainer}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={scrollToBottom}
          onLayout={scrollToBottom}
        >
          {messages.map((message) => (
            <Message key={message.id} {...message} />
          ))}

          {showTopicOptions && (
            <TopicConfirmator
              key="topic-confirmator"
              onConfirm={handleConfirmTopic}
              onSkip={handleQuitTopic}
            />
          )}
        </ScrollView>

        {isConnected ? (
          <View style={styles.inputSection}>
            <View style={styles.inputContainer}>
              <Pressable
                style={styles.mrWeekButton}
                onPress={handleMrWeekResponse}
                disabled={isResponseLoading}
                onLongPress={handleModal}
              >
                <Image
                  source={mrWeekPicture}
                  style={{ width: 38, height: 38 }}
                />
              </Pressable>

              <TextInput
                ref={inputRef}
                style={[
                  styles.input,
                  isResponseLoading && styles.disabledInput,
                ]}
                value={text}
                onChangeText={setText}
                placeholder="Type a message..."
                placeholderTextColor={theme.colors.gray}
                multiline={true}
                onKeyPress={handleKeyPress}
                onSubmitEditing={handleSubmitEditing}
                returnKeyType="send"
                submitBehavior="blurAndSubmit"
                editable={!isResponseLoading} // Disable input while loading
              />
            </View>
          </View>
        ) : (
          <View style={styles.dashboardLinkContainer}>
            <TextLink
              text="Dashboard"
              onPress={() => navigation.replace('Dashboard')}
              colorType="yellow"
            />
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;
