import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomSafeView from 'src/components/layouts/CustomSafeArea';

const OldSessionsView = ({ navigation, router }) => {

  const [chatSessionId, setChatSessionId] = useState(router.route.params.chat_session_id);

  const [messages, setMessages] = useState([]);
  const [title, setTitle] = useState('');
  const [previousId, setPreviousId] = useState({});
  const [nextId, setNextId] = useState({});

  const { get } = useOldSessions();

  useEffect(() => {
      get(chatSessionId).then((response) => {
        if (response.error) {
          showAlert('Error:', response.message);
        } else {
          setMessages(response.content.messages);
          setTitle(response.content.title);
          setPreviousId(response.content.previousId);
          setNextId(response.content.nextId);
        }
      });

  }, [chatSessionId]);

  const handleNow = () => {
    chatSessionId = null;
  };

  // Your code here

  return (
    <CustomSafeView scrollable>
      <DateButtons />
      <ArrowNavigation title={title} previous={previousId} next={nextId} />
      <ChatSession message={messages} title={title} />
    </CustomSafeView>
  );
};

export default OldSessionsView;
