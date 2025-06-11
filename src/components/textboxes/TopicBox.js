import React, { useCallback, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Text from 'src/components/common/Text';
import { useUserContext } from 'src/hooks/useUserContext';

// Create animated version of the custom Text component
const AnimatedText = Animated.createAnimatedComponent(Text);

const TopicBox = ({ id, title, text, width, height, navigation }) => {
  const { user, theme } = useUserContext();
  const animatedValue = useRef(new Animated.Value(0)).current;

  const backText = user.username;
  const buttonColor = theme.colors.violet_light;

  const styles = StyleSheet.create({
    container: {
      width: '100%',
    },
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

  const handlePress = () => {
    navigation.navigate('TopicDetail', { text, title, navigation, backText });
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
      >
        <Animated.View
          style={[
            styles.button,
            { backgroundColor: animatedBackgroundColor },
          ]}
        >
          <AnimatedText
            style={[styles.buttonText, { color: animatedTextColor }]}
          >
            {title}
          </AnimatedText>
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default TopicBox;
