import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Text from 'src/components/common/Text';
import { useUserContext } from 'src/hooks/useUserContext';

const TextLink = ({ text, onPress, color = null }) => {
  const { theme } = useUserContext();

  const styles = StyleSheet.create({
    textLink: {
      fontSize: theme.fontSizes.medium,
      color: color || theme.colors.yellow_light,
      fontWeight: 'bold',
      textAlign: 'center',
      padding: theme.spacing.medium,
    },
  });

  return (
    <TouchableOpacity onPress={onPress}>
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
