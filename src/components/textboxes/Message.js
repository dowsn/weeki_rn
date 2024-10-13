import { StyleSheet } from 'react-native';

const Message = ({ id, sender, date_created, text  }) => {

  const { theme } = useUserContext();

  const customStyles = StyleSheet.create({
    messagesContainer: {
      flex: 1,
    },
    messagesContent: {
      padding: 16,
    },

    messageContainer: {
      marginBottom: 16,
    },
    myMessageContainer: {
      alignItems: 'flex-end',
    },
    otherMessageContainer: {
      alignItems: 'flex-start',
    },
    messageBubble: {
      maxWidth: '80%',
      padding: 12,
      borderRadius: 20,
    },
    myMessageBubble: {
      backgroundColor: '#007AFF',
    },
    otherMessageBubble: {
      backgroundColor: '#E5E5EA',
    },
    myMessageText: {
      color: 'white',
    },
    otherMessageText: {
      color: 'black',
    },
    inputContainer: {
      padding: 16,
      backgroundColor: 'white',
      borderTopWidth: 1,
      borderTopColor: '#E5E5EA',
    },

    oneLineInput: {
      height: 40,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 20,
      paddingHorizontal: 16,
      fontSize: 16,
    },
  });

    return (
     <View
      key={id || message.date_created}
      style={[
        styles.chat.messageContainer,
        message.sender === 'user'
          ? styles.chat.myMessageContainer
          : styles.chat.otherMessageContainer
      ]}
    >
      <View
        style={[
          styles.chat.messageBubble,
          message.sender === 'user'
            ? styles.chat.myMessageBubble
            : styles.chat.otherMessageBubble,
        ]}
      >
        <Text
          style={
            message.sender === 'user'
              ? styles.chat.myMessageText
              : styles.chat.otherMessageText
          }
        >
          {text}
        </Text>
      </View>
    </View >
        )

}

export default Message
