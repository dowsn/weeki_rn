import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useUserContext } from 'src/hooks/useUserContext';
import { createStyles } from 'src/styles';

const CustomSafeView = ({ children }) => {
  const { user, setUser, theme } = useUserContext();

   const customStyles = StyleSheet.create({
     outerContainer: {
       flex: 1,
       backgroundColor: theme.colors.background, // Or whatever color you want
     },
     safeArea: {
       flex: 1,
     },
     innerContainer: {
       flex: 1,
       backgroundColor: theme.colors.background, // Same as outerContainer
       paddingHorizontal: theme.spacing.small, // Add padding to left and right
     },
   });


  return (
    <View style={customStyles.outerContainer}>
      <SafeAreaView
        style={customStyles.safeArea}
        edges={['right', 'top', 'left']}
      >
        <View style={customStyles.innerContainer}>{children}</View>
      </SafeAreaView>
    </View>
  );
};

export default CustomSafeView;
