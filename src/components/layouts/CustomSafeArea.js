import React from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { useUserContext } from 'src/hooks/useUserContext';
import { createStyles } from 'src/styles';

const CustomSafeView = ({ children, noPadding = false, ...otherProps }) => {
  const { user, setUser, theme } = useUserContext();

  const customStyles = StyleSheet.create({
    outerContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
      marginBottom: theme.spacing.small
    },
    safeArea: {
      flex: 1,
    },
    innerContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: noPadding ? 0 : theme.spacing.small,
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
  });

  return (
    <View style={customStyles.outerContainer}>
      <SafeAreaView style={customStyles.safeArea}>
        <View style={customStyles.innerContainer} {...otherProps}>
          {children}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default CustomSafeView;
