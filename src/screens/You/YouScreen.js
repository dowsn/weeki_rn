import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect } from 'react';
import {
  Image,
  Linking,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from 'react-native';
import NormalButton from 'src/components/buttons/NormalButton';
import TextLink from 'src/components/buttons/TextLink';
import MainTitle from 'src/components/common/MainTitle';
import { Text } from 'src/components/common/Text';
import CustomTextInput from 'src/components/forms/CustomTextInput';
import CustomSafeView from 'src/components/layouts/CustomSafeArea';
import SpacingView from 'src/components/layouts/SpacingView';
import { useUserContext } from 'src/hooks/useUserContext';
import { showAlert } from 'src/utils/alert';
import EditProfileScreen from './EditProfileScreen';
import SubscriptionScreen from './SubscriptionScreen';

const YouScreen = () => {
  const { theme, user, logout } = useUserContext();
  const navigation = useNavigation();

  const handleLogout = () => {
    logout();
  }



  // Initialize form with user data


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    logoContainer: {
      alignItems: 'center',
      marginTop: 20,
    },
    mainLogo: {
      width: 120,
      height: 120,
      alignSelf: 'center',
    },
    contentWrapper: {
      flex: 1,
      justifyContent: 'center',
    },
    contentContainer: {
      paddingHorizontal: 20,
    },
    footerPart: {
      height: 140,
    },
    reminderContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 10,
      marginBottom: 15,
    },
    reminderText: {
      fontSize: 16,
    },
  });



  return (
    <CustomSafeView scrollable keyboardShouldPersistTaps="handled">
      <SpacingView style={styles.contentWrapper}>
        {/* <NormalButton
          text={'Topics Archive'}
          onPress={() => navigation.navigate('TopicsArchive')}
        /> */}
        <NormalButton
          text={'Update Profile'}
          onPress={() => navigation.navigate('EditProfile')}
        />
        <NormalButton text={'Logout'} onPress={handleLogout} />
      </SpacingView>
      <SpacingView spacing="large" style={styles.footerPart}>
        <TextLink text="Dashboard" onPress={() => navigation.goBack()} color={theme.colors.violet_light} />
      </SpacingView>
    </CustomSafeView>
  );
};

export default YouScreen;
