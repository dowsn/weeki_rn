import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useUserContext } from 'src/hooks/useUserContext';

const TextLink = ({ text, onPress }) => {
  const { theme } = useUserContext();

  const styles = StyleSheet.create({
    textLink: {
      fontSize: theme.fontSizes.medium,
      color: theme.colors.light,
      textDecorationLine: 'underline',
      fontWeight: 'bold',
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
};

export default TextLink;
