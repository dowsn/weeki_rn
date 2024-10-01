import Ionicons from '@expo/vector-icons/Ionicons';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
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
import { useFeed } from '../../hooks/useFeed';
import PickListSelector from '../../navigation/PickListSelector';
import Error from '../common/Error';
import FeedList from '../lists/FeedList';

const FeedView = ({ navigation }) => {
  // const [pickLists, feeds, isLoading, error] = useFeed();

  const { container, activityIndicator } = styles


  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'VarelaRound-Regular': require('../../../assets/fonts/VarelaRound-Regular.ttf'),
      });
    }

    loadFonts();
  }, []);

  // if (!fontsLoaded) {
  //   return <AppLoading />;
  // }
  return (
    <SafeAreaView style={container}>
      {/* {error ? (
        <Error message={error} />
      ) : feeds && !isLoading ? ( */}
      <>
          <View>
            <Image
              source={require('../../../assets/logo/WeekiLogo.png')}
              style={{ width: 200, height: 200, alignSelf: 'center' }}
            />
<Text style={{ fontFamily: 'VarelaRound-Regular', textAlign: 'center', fontSize: 20 * 3, margin: 10 }}>
    Week
</Text>
          </View>
          {/* <PickListSelector data={pickLists} />
          <FeedList data={feeds} /> */}
        </>
      {/* ) : (
        <DotIndicator size={10} count={3} color="black" />
      )} */}
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
