import * as Font from 'expo-font';
// src/contexts/FontContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const FontContext = createContext({});

export const FontProvider = ({ children }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'VarelaRound-Regular': require('../../assets/fonts/VarelaRound-Regular.ttf'),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
      }
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <FontContext.Provider value={{ fontsLoaded }}>
      {fontsLoaded ? children : null}
    </FontContext.Provider>
  );
};

export const useFontContext = () => useContext(FontContext);
