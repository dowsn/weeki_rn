import React, { useCallback, useRef } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useUserContext } from 'src/hooks/useUserContext';
import { createStyles } from 'src/styles';

const { width } = Dimensions.get('window');

const NormalButton = ({ text, onPress, inverted = false }) => {
  const { theme } = useUserContext();
  const styles = createStyles(theme);

  const animatedValue = useRef(new Animated.Value(0)).current;

  const customStyles = StyleSheet.create({
    button: {
      alignSelf: 'center',
      paddingVertical: theme.spacing.medium,
      width: '100%',
      paddingHorizontal: 0,
      backgroundColor: theme.colors.violet_darkest,
      borderRadius: theme.borderRadii.large * 2,
      marginVertical: theme.spacing.small,
      borderWidth: 1,
      borderColor: theme.colors.yellow_light,
    },
    buttonText: {
      fontSize: theme.fontSizes.medium,
      color: theme.colors.yellow_light,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });

  const animatedBackgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.violet_darkest, theme.colors.yellow_light],
  });

  const animatedTextColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.yellow_light, theme.colors.violet_darkest],
  });

  const handlePressIn = useCallback(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false, // Changed to false
    }).start();
  }, [animatedValue]);

  const handlePressOut = useCallback(() => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false, // Changed to false
    }).start();
  }, [animatedValue]);

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View
        style={[
          customStyles.button,
          { backgroundColor: animatedBackgroundColor },
        ]}
      >
        <Animated.Text
          style={[customStyles.buttonText, { color: animatedTextColor }]}
        >
          {text}
        </Animated.Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default React.memo(NormalButton);
