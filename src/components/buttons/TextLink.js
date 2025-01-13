import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Text from 'src/components/common/Text';
import { useUserContext } from 'src/hooks/useUserContext';

const TextLink = ({ text, onPress, color = null }) => {
  const { theme } = useUserContext();

  const styles = StyleSheet.create({
    container: {
      width: '100%',
      alignItems: 'center',
    },
    touchable: {
      width: '100%',
    },
    textLink: {
      color: color || theme.colors.yellow_light,
      fontSize: theme.fontSizes.medium,
      textAlign: 'center',
      padding: theme.spacing.medium,
    },
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.textLink}>{text}</Text>
    </TouchableOpacity>
  );
};

TextLink.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  color: PropTypes.string,
};

export default TextLink;
