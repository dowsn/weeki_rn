import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FeedSeparator from '../common/FeedSeparator';
import NoteElement from '../list_elements/NoteElement';
import Message from '../textboxes/Message';
import Note from '../textboxes/Note';
import EmptyList from './EmptyList';

const ChatList = ({ data }) => {
  const { theme } = useUserContext();

  const customStyles = StyleSheet.create({
    chatList: {
      flex: 1,
      marginBottom: theme.spacing.small,
    },
  });

  const renderItem = ({ item }) => {
    return (
      <Message
        id={item.id}
        sender={item.sender}
        date_created={item.date_created}
        text={item.text}
      />
    );
  };

  return (
    <View>
      <FlatList
        style={chatList}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default FeedList;
