import { Picker } from "@react-native-picker/picker";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
import { UserContext } from "../../contexts/UserContext";
import { useCities } from "../../hooks/useCities";

const CitySelectorView = () => {
  const { container, pickerContainer, picker } = styles;
  const [user, setUser] = useContext(UserContext);
  const [cities, error, isLoading] = useCities();

  const changeCity = (itemValue) => {
    const selectedCity = cities.find((city) => city.id == itemValue);
    console.log(selectedCity);
    setUser((prevUser) => ({
      ...prevUser,
      selectedCityId: itemValue,
      selectedCityShortName: selectedCity.short_name,
      selectedPickListIndex: 0,
      lat: selectedCity.lat,
      long: selectedCity.long,
    }));
  };

  if (isLoading) {
    return <DotIndicator size={10} count={3} color="black" />;
  } else {
    return (
      <SafeAreaView style={container}>
        <View style={pickerContainer}>
          {cities && cities.length > 0 && (
            <Picker
              selectedValue={user.selectedCityId}
              onValueChange={(itemValue) => changeCity(itemValue)}
              style={picker}
            >
              {cities.map((city, index) => (
                <Picker.Item
                  key={city.id}
                  label={city.name + " - " + city.short_name}
                  value={city.id}
                />
              ))}
            </Picker>
          )}
        </View>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },

  pickerContainer: {
    width: "100%",
    justifyContent: "center",
  },

  picker: {
    width: "100%",
  },
});

export default CitySelectorView;
