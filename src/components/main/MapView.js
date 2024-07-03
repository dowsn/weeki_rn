import { GOOGLE_MAPS_API_KEY } from '@env';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MapView = ({user}) => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async() => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      console.log(location);
    })();
  }, []);


  return (
    <SafeAreaView>
      <Text>Your longitude:{location?.coords?.longitude}</Text>
      <Text>Your latitude:{location?.coords?.latitude}</Text>
    </SafeAreaView>
  );
}

export default MapView;