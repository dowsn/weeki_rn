// src/components/common/Text.js
import React from 'react';
import { Text as RNText, TextInput as RNTextInput } from 'react-native';

const defaultTextStyle = { fontFamily: 'VarelaRound-Regular' };


export const Text = React.forwardRef(({ style, ...props }, ref) => (
  <RNText
    ref={ref}
    {...props}
    style={[{ fontFamily: 'VarelaRound-Regular' }, style]}
  />
));

export const TextInput = React.forwardRef((props, ref) => (
  <RNTextInput ref={ref} {...props} style={[defaultTextStyle, props.style]} />
));

export default Text;
