import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import NormalButton from 'src/components/buttons/NormalButton';
import TextLink from 'src/components/buttons/TextLink';
import CustomSafeView from 'src/components/layouts/CustomSafeArea';
import SpacingView from 'src/components/layouts/SpacingView';
import { useUserContext } from 'src/hooks/useUserContext';

const YouScreen = () => {
  const { theme, logout } = useUserContext();
  const navigation = useNavigation();

  const handleLogout = () => {
    logout();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    contentWrapper: {
      flex: 1,
      justifyContent: 'center',
    },
    footerPart: {
      justifyContent: 'flex-end', // This will push the content to the bottom
    },
  });

  return (
    <CustomSafeView scrollable keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <SpacingView style={styles.contentWrapper}>
          <NormalButton
            text={'Update Profile'}
            onPress={() => navigation.navigate('EditProfile')}
          />
          <NormalButton text={'Logout'} onPress={handleLogout} />
        </SpacingView>

        <View style={styles.footerPart}>
          <TextLink
            text="Focusboard"
            onPress={() => navigation.goBack()}
            color={theme.colors.violet_light}
          />
        </View>
      </View>
    </CustomSafeView>
  );
};

export default YouScreen;
