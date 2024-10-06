import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useUserContext } from 'src/hooks/useUserContext';

const { width } = Dimensions.get('window');

const NormalButton = ({
  text,
  colorPair = 'primary',
  onPress,
  inverted = false,
}) => {

  const { user, setUser, theme } = useUserContext();
  const styles = createStyles(theme);

  const customStyles = StyleSheet.create({
    button: {
      alignSelf: 'center',
      padding: styles.spacing.medium,
      borderRadius: styles.borderRadii.medium,
      marginVertical: styles.spacing.small,
    },
    buttonText: {
      fontSize: styles.fontSizes.large,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });

  const getButtonColors = () => {
    const baseColor = colors[colorPair];
    const textColor = dark ? colors.background : colors.text;

    return inverted
      ? { backgroundColor: textColor, color: baseColor }
      : { backgroundColor: baseColor, color: textColor };
  };

  const { backgroundColor, color } = getButtonColors();

  return (
    <TouchableOpacity
      style={[customStyles.button, { backgroundColor }]}
      onPress={onPress}
    >
      <Text style={[customStyles.buttonText, { color }]}>{text}</Text>
    </TouchableOpacity>
  );
};

export default CustomWideButton;
