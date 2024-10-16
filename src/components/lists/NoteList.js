import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FeedSeparator from '../common/FeedSeparator';
import NoteElement from '../list_elements/NoteElement';
import Note from '../textboxes/Note';
import EmptyList from './EmptyList';

const NoteList = ({ title, data }) => {
    const { theme } = useUserContext();

    const customStyles = StyleSheet.create({
      noteList: {
        flex: 1,
        marginBottom: theme.spacing.small,

      },
    });

  const renderItem = ({ item }) => {
    return (
      <Note
        id={item.id}
        topicColor={item.topicColor}
        date_created={item.date_created}
        text={item.text}
      />
    );
  };

  return (
    <View>
      <Subtitle>{title}</Subtitle>
      <FlatList
        style={noteList}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={EmptyList}
      />
    </View>
  );
};




export default FeedList;
