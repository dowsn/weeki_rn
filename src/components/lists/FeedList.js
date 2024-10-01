import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import EmptyFeedList from '../common/EmptyFeedList';
import FeedSeparator from '../common/FeedSeparator';
import FeedElement from '../list_elements/FeedElement';

const FeedList = ({ data }) => {
  const navigation = useNavigation();
  const { feedList } = styles;

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => navigation.navigate("ExhibitionDetail", { item: item })}
      >
        <FeedElement title={item.title} images={item.images} />
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      style={feedList}
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={FeedSeparator}
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
