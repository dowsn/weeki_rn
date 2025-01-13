import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import TextLink from 'src/components/buttons/TextLink';
import { Text } from 'src/components/common/Text';
import CustomSafeView from 'src/components/layouts/CustomSafeArea';
import Message from 'src/components/textboxes/Message';
import { useUserContext } from 'src/hooks/useUserContext';

const PastChatScreen = (router) => {
  const { theme } = useUserContext();
  const navigation = useNavigation();
  const { messages } = router.route.params;
  const scrollViewRef = React.useRef();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.violet_darkest,
    },
    messagesContainer: {
      flex: 1,
    },
    contentContainer: {
      flexGrow: 1,
      // padding: theme.spacing.medium,
      paddingBottom: 80,
      paddingTop: theme.spacing.large + 20,
    }
  });

  return (
    <CustomSafeView>
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.contentContainer}
      >
        {messages.map((message) => (
          <Message
            key={message.id}
            sender={message.role === 'user' ? 'user' : 'assistant'}
            text={message.content}
            date_created={message.date_created}
          />
        ))}
      </ScrollView>
      <TextLink text="Moments" onPress={() => navigation.goBack()} />
    </CustomSafeView>
  );
};

export default PastChatScreen;
