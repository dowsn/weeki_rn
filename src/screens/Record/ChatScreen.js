import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
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
import { useNote } from 'src/hooks/useNote';
import { useUserContext } from 'src/hooks/useUserContext';
import { showAlert } from 'src/utils/alert';

const ChatScreen = () => {
  const { theme, user } = useUserContext();
  const navigation = useNavigation();
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const { saveNote, suggestQuestion, isLoading } = useNote();
  const scrollViewRef = React.useRef();
  const inputRef = React.useRef();


  const defaultUserPicture = www + 'media/images/others/images/others/default_profile_picture.png';
  const mrWeekPicture = www + 'media/images/others/images/others/mr_week_profile_picture.png';

  const tabIcons = {
    Done: require('assets/icons/Done.png'),
    MrWeek: require('assets/icons/MrWeek.png'),
  };

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (event) => {
        setKeyboardHeight(event.endCoordinates.height);
      },
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      },
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const handleAddMessage = () => {
    if (text.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: text.trim(),
        sender: 'user',
        date_created: new Date().toISOString(),
        profilePicture: user.profilePicture || defaultUserPicture,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setText(''); // Clear the input

      // Ensure the scroll happens after the message is added
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleKeyPress = ({ nativeEvent }) => {
    // Check if return/enter key is pressed without shift
    if (nativeEvent.key === 'Enter' && !nativeEvent.shiftKey) {
      // Prevent default new line
      nativeEvent.preventDefault?.();
      handleAddMessage();
    }
  };

  const handleQuestion = async () => {
    if (!text.trim()) return;

    try {
      const response = await suggestQuestion(user.userId, text);
      if (response.error) {
        showAlert('Error', response.message);
      } else {
        handleAddMessage();
        const mrWeekMessage = {
          id: (Date.now() + 1).toString(),
          text: response.message,
          sender: 'assistant',
          date_created: new Date().toISOString(),
          profilePicture: mrWeekPicture,
        };
        setMessages((prevMessages) => [...prevMessages, mrWeekMessage]);

        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    } catch (error) {
      showAlert('Error', error.message || 'An unexpected error occurred');
    }
  };

  const TabItem = ({ special_title, name, onPress, isLoading }) => (
    <Pressable style={styles.tabItem} onPress={onPress} disabled={isLoading}>
      <Image
        source={tabIcons[name]}
        style={{
          width: 24,
          height: 24,
          tintColor: '#FFFFFF',
        }}
      />
      <Text style={styles.tabText}>{special_title ? special_title : name}</Text>
    </Pressable>
  );

  const styles = StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: theme.colors.dark,
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    contentContainer: {
      flex: 1,
      padding: theme.spacing.medium,
      paddingBottom: 140,
    },
    messagesContainer: {
      flex: 1,
      paddingHorizontal: 12,
    },
    bottomContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.background,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end', // Changed to flex-end to align with growing input
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: theme.colors.background,
      borderTopWidth: 1,
      borderTopColor: 'rgba(0, 0, 0, 0.1)',
    },
    input: {
      flex: 1,
      backgroundColor: '#F0F0F0',
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginRight: 8,
      fontSize: theme.fontSizes.medium,
      maxHeight: 100, // This limits how tall the input can grow
      minHeight: 40, // This ensures a minimum height
      color: '#000000',
      width: '95%',
    },
    tabBar: {
      flexDirection: 'row',
      backgroundColor: '#0A2140',
      height: 60, // Slightly reduced fixed height
      justifyContent: 'center',
      alignItems: 'center',
    },
    tabItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
    },
    tabText: {
      fontSize: theme.fontSizes.middle,
      marginTop: theme.spacing.small,
      color: '#FFFFFF',
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 70 : 0}
    >
      <View style={styles.container}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.contentContainer}
          keyboardDismissMode="on-drag"
        >
          {messages.map((message) => (
            <Message key={message.id} {...message} />
          ))}
        </ScrollView>

        <View style={styles.bottomContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={text}
              onChangeText={setText}
              placeholder="Type a message..."
              placeholderTextColor="#999"
              multiline={true}
              onKeyPress={handleKeyPress}
              blurOnSubmit={false}
            />
          </View>

          <View style={styles.tabBar}>
            <TabItem
              name="Done"
              onPress={() => navigation.navigate('Reflect')}
              disabled={isLoading}
            />
            <TabItem
              special_title="Mr. Week"
              name="MrWeek"
              onPress={handleQuestion}
              disabled={isLoading}
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;