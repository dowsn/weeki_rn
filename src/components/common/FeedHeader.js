import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useContext, useState } from 'react';
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { UserContext } from '../../contexts/UserContext';

// import CitySelector from "../main/CitySelectorView";

const FeedHeader = () => {
  const { container, text, safeArea, arrowDown } = styles;

  const [user, setUser] = useContext(UserContext);
  const navigation = useNavigation();

  return (
    <>
    </>
    // <SafeAreaView style={safeArea}>
    //   {/* <TouchableOpacity
    //     onPress={() => navigation.navigate("CitySelectorView")}
    //     style={container}
    //     activeOpacity={0.5}
    //   >
    //     <Ionicons style={arrowDown} name="chevron-down" />
    //     <Text style={text}>{user["selectedCityShortName"]}</Text>
    //   </TouchableOpacity> */}
    // </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 24 : 0,
    backgroundColor: "black",
  },
  arrowDown: {
    paddingRight: 5,
    color: "white",
    fontSize: 20,
  },
  container: {
    backgroundColor: "black",
    flexDirection: "row",
    paddingRight: 15,
    paddingTop: 12.5,
    paddingBottom: 12.5,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
export default FeedHeader;
