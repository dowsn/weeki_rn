// NormalButton.js
import React, { useCallback, useRef } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { Text } from 'src/components/common/Text';
import { useUserContext } from 'src/hooks/useUserContext';
import { createStyles } from 'src/styles';

const { width } = Dimensions.get('window');
const AnimatedText = Animated.createAnimatedComponent(Text);

const NormalButton = ({ text, onPress, colorType = 'yellow' }) => {
  const { theme } = useUserContext();
  const styles = createStyles(theme);
  const animatedValue = useRef(new Animated.Value(0)).current;

  const getButtonColor = () => {
    switch (colorType) {
      case 'violet':
        return theme.colors.violet_light;
      case 'green':
        return theme.colors.green;
      case 'red':
        return theme.colors.red;
      case 'yellow':
      default:
        return theme.colors.yellow_light;
    }
  };

  const buttonColor = getButtonColor();

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
      borderColor: buttonColor,
    },
    buttonText: {
      fontSize: theme.fontSizes.medium,
      color: buttonColor,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });

  const animatedBackgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.violet_darkest, buttonColor],
  });

  const animatedTextColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [buttonColor, theme.colors.violet_darkest],
  });

  const handlePressIn = useCallback(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [animatedValue]);

  const handlePressOut = useCallback(() => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
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
        <AnimatedText
          style={[customStyles.buttonText, { color: animatedTextColor }]}
        >
          {text}
        </AnimatedText>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default React.memo(NormalButton);
