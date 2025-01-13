import { useFonts } from 'expo-font';
import React from 'react';
import {
  Platform,
  Text as RNText,
  TextInput as RNTextInput,
} from 'react-native';

const getFontFamily = () => {
  return Platform.select({
    ios: 'VarelaRound-Regular',
    android: 'VarelaRound-Regular',
  });
};

const defaultTextStyle = {
  fontFamily: getFontFamily(),
};

export const Text = React.forwardRef(({ style, ...props }, ref) => {
    console.log('Text component rendered with style:', style);


  const combinedStyle = [
    defaultTextStyle,
    style,
    Platform.select({
      android: { fontWeight: style?.fontWeight || 'normal' },
    }),
  ];

  return <RNText ref={ref} {...props} style={combinedStyle} />;
});

export const TextInput = React.forwardRef((props, ref) => (
  <RNTextInput ref={ref} {...props} style={[defaultTextStyle, props.style]} />
));

export default Text;
