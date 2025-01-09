import PropTypes from 'prop-types';
import React from 'react';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
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
      // The font family will be inherited from the Text component
    },
  });

  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.textLink}>{text}</Text>
    </TouchableOpacity>
  );
};

export default TextLink;
