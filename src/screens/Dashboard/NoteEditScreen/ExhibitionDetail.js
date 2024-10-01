import Ionicons from '@expo/vector-icons/Ionicons';
import moment from 'moment';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
} from 'react-native-indicators';
import useImageLoader from '../../../hooks/useImageLoader';

const ExhibitionDetail = ({ route }) => {
  const { item } = route.params;
  const { title, opening_start, images } = item;
  // const [count, setCount] = useState(0);

  const mainImage = images[0].url;
  const { isLoading, isError, imageData } = useImageLoader(mainImage);

  // const { title } = item;

  return (
    <View style={styles.container}>
      <View style={styles.overlay}>
        {isLoading && <DotIndicator size={10} count={3} color="black" />}
      </View>
      <ImageBackground
        style={styles.background}
        source={imageData ? { uri: imageData } : null}
      >
        {/* {isError && <Text>Error loading image</Text>} */}
        {isLoading ? null : <Text style={styles.titleText}>{title}</Text>}
      </ImageBackground>
      <View style={styles.body}>
        {images[0].credits ? (
          <Text style={styles.credits}>© {images[0].credits}</Text>
        ) : null}
        {/* <Text>Time: {moment(opening_start).format("DD. MM. YYYY")}</Text> */}
      </View>
      {/* <Ionicons name="checkmark-circle" size={32} color="green" /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    resizeMode: "cover",
    height: 250,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    textShadowColor: "black",
    textShadowOffset: { width: 0, height: 0 },
    padding: 20,
    textShadowRadius: 20,
  },

  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },

  button: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },

  credits: {
    fontSize: 10,
    color: "#aaa",
  },

  body: {
    padding: 10,
    display: "flex",
    gap: 10,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },

  footer: {
    fontSize: 20,
    justifyContent: "flex-end",
    alignItems: "flex-start",
    flexDirection: "row",
  },
});

export default ExhibitionDetail;
