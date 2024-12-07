import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Message from 'src/components/textboxes/Message';
import { www } from 'src/constants/constants';
import { useAgentChat } from 'src/hooks/useChatAgent';
import { useNote } from 'src/hooks/useNote';
import { useUserContext } from 'src/hooks/useUserContext';
import { showAlert } from 'src/utils/alert';
import { prepareMessages } from 'src/utils/messages';
import { prepareTopics } from 'src/utils/topics';

const ChatScreen = () => {
  const { theme, user } = useUserContext();

  console.log(user);
  const navigation = useNavigation();
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const { chat, isLoading } = useNote();
  const scrollViewRef = React.useRef();
  const inputRef = React.useRef();


  const { sendMessage } = useAgentChat((streamedText) => {
    setMessages((prev) => {
      const updated = [...prev];
      const lastMessage = updated[updated.length - 1];
      if (lastMessage?.sender === 'assistant') {
        updated[updated.length - 1] = {
          ...lastMessage,
          text: lastMessage.text + streamedText,
        };
      }
      return updated;
    });
  });

  const defaultUserPicture =
    www + 'media/images/others/default_profile_picture.png';
  const mrWeekPicture = www + 'media/images/others/mr_week_profile_picture.png';

  const tabIcons = {
    Done: require('assets/icons/Done.png'),
    MrWeek: require('assets/icons/MrWeek.png'),
  };

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
        profilePicture: user.profileImage || defaultUserPicture,
        followup: isFollowUp,
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setText('');

      // Scroll to bottom immediately and after a short delay to ensure content is rendered
      scrollToBottom();
      setTimeout(scrollToBottom, 100);
    }
  };

  const handleSubmitEditing = () => {
    if (text.trim()) {
      handleAddMessage();
    }
  };

  const handleQuery = () => {
  if (text.trim()) {
    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      text: '',
      sender: 'assistant',
      date_created: new Date().toISOString(),
      profilePicture: mrWeekPicture
    }]);
    sendMessage(text);
  }
};



// Claude can make mistakes. Please double-check responses.

  // const handleQuery = async () => {
  //   const { query, history } = prepareMessages(messages);
  //   const topics = prepareTopics(user.topics);

  //   try {
  //     const response = await chat(user.userId, query, history, topics);
  //     if (response.error) {
  //       showAlert('Error', response.message);
  //     } else {
  //       handleAddMessage();
  //       const mrWeekMessage = {
  //         id: (Date.now() + 1).toString(),
  //         text: response.message,
  //         sender: 'assistant',
  //         date_created: new Date().toISOString(),
  //         profilePicture: mrWeekPicture,
  //       };
  //       setMessages((prevMessages) => [...prevMessages, mrWeekMessage]);

  //       setTimeout(() => {
  //         scrollViewRef.current?.scrollToEnd({ animated: true });
  //       }, 100);
  //     }
  //   } catch (error) {
  //     showAlert('Error', error.message || 'An unexpected error occurred');
  //   }
  // };

  const TabItem = ({
    special_title,
    name,
    onPress,
    isLoading,
    image = false,
  }) => (
    <Pressable style={styles.tabItem} onPress={onPress} disabled={isLoading}>
      <Image
        source={image ? { uri: image } : tabIcons[name]}
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
        }}
      />
    </Pressable>
  );

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
      backgroundColor: '#cfd4db', // Match keyboard color
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    messagesContainer: {
      flex: 1,
    },
    contentContainer: {
      flexGrow: 1,
      padding: theme.spacing.medium,
      paddingBottom: getBottomPadding(),
      paddingTop: 120,
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
      backgroundColor: '#cfd4db', // Match keyboard color
      borderTopWidth: 1,
      borderTopColor: 'rgba(0, 0, 0, 0.1)',
      paddingBottom: Platform.OS === 'ios' ? 0 : 16, // Increased padding
    },
    inputContainer: {
      paddingHorizontal: theme.spacing.medium,
      paddingVertical: 8,
      paddingBottom: 40,
    },
    input: {
      backgroundColor: '#F0F0F0',
      borderRadius: theme.borderRadii.large,
      paddingHorizontal: theme.spacing.medium,
      paddingVertical: 10, // Adjusted to center text
      fontSize: 16,
      maxHeight: 120,
      minHeight: 40,
      color: '#000000',
      textAlignVertical: 'center', // Added to center the cursor/text
    },
    mrWeekButton: {
      position: 'absolute',
      right: 16,
      top: -48,
      zIndex: 1,
    },
  });


  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
      // keyboardVerticalOffset={getKeyboardOffset() - 60}
    >
      <View style={styles.container}>
        {/* Floating Done Button */}
        <View style={styles.floatingControls}>
          <Pressable
            style={styles.circleButton}
            onPress={() => navigation.navigate('Reflect')}
          >
            <Image
              source={tabIcons.Done}
              style={{ width: 56, height: 56, tintColor: 'white' }}
            />
          </Pressable>
        </View>

        {/* Messages ScrollView */}
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
        </ScrollView>

        {/* Input Section */}
        <View style={styles.inputSection}>
          <View style={styles.inputContainer}>
            {/* Mr Week Button */}
            <Pressable
              style={styles.mrWeekButton}
              onPress={handleQuery}
              disabled={isLoading}
            >
              <Image
                source={{ uri: mrWeekPicture }}
                style={{ width: 38, height: 38, borderRadius: 18 }}
              />
            </Pressable>

            <TextInput
              ref={inputRef}
              style={styles.input}
              value={text}
              onChangeText={setText}
              placeholder="Type a message..."
              placeholderTextColor="#999"
              multiline={true}
              onKeyPress={handleKeyPress}
              onSubmitEditing={handleSubmitEditing}
              returnKeyType="send"
              blurOnSubmit={true}
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;