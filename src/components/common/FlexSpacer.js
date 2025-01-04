import React from 'react';
import { View } from 'react-native';

const FlexSpacer = ({ flex = 1, minHeight = 20 }) => <View style={{ flex, minHeight }} />;

export default FlexSpacer;
