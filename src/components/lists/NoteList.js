import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FeedSeparator from '../common/FeedSeparator';
import NoteElement from '../list_elements/NoteElement';
import EmptyFeedList from './EmptyList';

const NoteList = ({ data }) => {
  const navigation = useNavigation();
  const { feedList } = styles;

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => navigation.navigate("NoteDetail", { item: item })}
      >
        <NoteElement title={item.title} images={item.images} />
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      style={feedList}
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={NoteSeparator}
      ListEmptyComponent={EmptyFeedList}
    />
  );
};

const styles = {
  feedList: {
    backgroundColor: "white",
  },
};

export default FeedList;
