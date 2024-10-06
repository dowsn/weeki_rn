import React from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  Text,
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
import useImageLoader from '../../hooks/useImageLoader';

const NoteElement = (props) => {
  const { item, background, titleText, activityIndicator } = styles;
  const { title, images } = props;

  const mainImage = images[0];
  const { isLoading, isError, imageData } = useImageLoader(mainImage?.url);

  return (
    <View style={item}>
      <View style={styles.overlay}>
        {isLoading && <DotIndicator size={10} count={3} color="black" />}
      </View>
      <ImageBackground
        source={imageData ? { uri: imageData } : null}
        style={background}
      >
        {/* {isError && <Text>Error loading image</Text>} */}
        {isLoading ? null : <Text style={titleText}>{title}</Text>}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: "white",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
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
  activityIndicator: {
    position: "absolute",
    top: "50%",
    left: "50%",
  },
  background: {
    flex: 1,
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
});

export default NoteElement;
