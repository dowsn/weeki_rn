import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useUserContext } from 'src/hooks/useUserContext';

const SpacingView = ({ children, spacing = 'small', ...otherProps }) => {
  const { theme } = useUserContext();

  const styles = StyleSheet.create({
    spacer: {
      marginBottom: theme.spacing[spacing],
    },
  });

  return (
    <View {...otherProps}>
      {React.Children.map(children, (child, index) => (
        <View
          key={index}
          style={
            index < React.Children.count(children) - 1 ? styles.spacer : null
          }
        >
          {child}
        </View>
      ))}
    </View>
  );
};

export default SpacingView;
