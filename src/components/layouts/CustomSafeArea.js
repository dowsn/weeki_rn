import React, { useMemo } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { useUserContext } from 'src/hooks/useUserContext';

const CustomSafeView = ({
  children,
  noPadding = false,
  scrollable = false,
  contentContainerStyle,
  keyboardShouldPersistTaps = 'handled',
  ...otherProps
}) => {
  const { theme } = useUserContext();

  const customStyles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.colors.background,
        },
        scrollView: {
          flexGrow: 1,
        },
        contentContainer: {
          flexGrow: 1,
          paddingHorizontal: noPadding ? 0 : theme.spacing.small,
          paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
          paddingBottom: theme.spacing.small,
        },
      }),
    [theme, noPadding],
  );

  const content = useMemo(() => {
    if (scrollable) {
      return (
        <ScrollView
          style={customStyles.scrollView}
          contentContainerStyle={[
            customStyles.contentContainer,
            contentContainerStyle,
          ]}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
          bounces={false}
          showsVerticalScrollIndicator={false}
          {...otherProps}
        >
          {children}
        </ScrollView>
      );
    }

    return (
      <View style={[customStyles.contentContainer, contentContainerStyle]}>
        {children}
      </View>
    );
  }, [
    scrollable,
    children,
    customStyles,
    contentContainerStyle,
    keyboardShouldPersistTaps,
    otherProps,
  ]);

  return (
    <SafeAreaView style={customStyles.container}>
      <KeyboardAvoidingView
        style={customStyles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        {content}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CustomSafeView;
