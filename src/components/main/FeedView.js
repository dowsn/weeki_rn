import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet } from "react-native";
import { useFeed } from "../../hooks/useFeed";
import Error from "../divs/Error";
import FeedList from "../lists/FeedList";
import PickListSelector from "../nav/PickListSelector";
import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator,
} from "react-native-indicators";

const FeedView = ({ navigation }) => {
  const [pickLists, feeds, isLoading, error] = useFeed();
  const { container, activityIndicator } = styles;

  return (
    <SafeAreaView style={container}>
      {error ? (
        <Error message={error} />
      ) : feeds && !isLoading ? (
        <>
          <PickListSelector data={pickLists} />
          <FeedList data={feeds} />
        </>
      ) : (
        <DotIndicator size={10} count={3} color="black" />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // fills available space
    backgroundColor: "white",
    width: "100%",
    justifyContent: "center",
  },
});

export default FeedView;
