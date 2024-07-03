import React, { useContext, useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { UserContext } from "../../contexts/UserContext";

const PickListSelector = ({ data }) => {
  const {
    selectedItem,
    pickListElement,
    pickListImage,
    selectedText,
    pickListText,
  } = styles;
  const [user, setUser] = useContext(UserContext);
  const [selected, SetSelected] = useState(user.selectedPickListIndex);

  const changePickList = (index) => {
    SetSelected(index);

    setUser((prevUser) => ({
      ...prevUser,
      selectedPickListIndex: index,
    }));
  };

  const renderPickList = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => changePickList(index)}
        style={[pickListElement, selected == index ? selectedItem : {}]}
        activeOpacity={0.5}
      >
        <Image
          source={{ uri: item.thumbnail }}
          style={[pickListImage, selected == index ? selectedText : {}]}
        />
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          style={[pickListText, selected == index ? selectedText : {}]}
        >
          {item.name.trimEnd()}
        </Text>
      </TouchableOpacity>
    );
  };

  const { container } = styles;

  return (
    <SafeAreaView>
      <FlatList
        style={container}
        data={data}
        renderItem={renderPickList}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ alignItems: "center" }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  pickListElement: {
    justifyContent: "flex-start",
    alignItems: "center",
    display: "flex",
    gap: 2.5,
    width: 85,
    height: 85,
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  selectedItem: {
    backgroundColor: "black",
  },
  selectedText: {
    color: "white",
  },
  pickListImage: {
    width: 50,
    height: 50,
    borderRadius: 25, // half of your width and height
  },
  selectedImage: {
    // increase brightness
  },
  pickListText: {
    color: "black",
    textAlign: "center",
    fontSize: 10,
  },
  container: {
    // paddingVertical: 5,
    // paddingHorizontal: 5
    backgroundColor: "white"
  },
});

export default PickListSelector;
