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
import { useUpdateProfile } from 'src/hooks/useUpdateProfile';
import { useUserContext } from 'src/hooks/useUserContext';
import { showAlert } from 'src/utils/alert';

const DeleteProfileScreen = () => {
  const { theme, logout } = useUserContext();
  const navigation = useNavigation();
  const { deleteProfile, isLoading, error } = useUpdateProfile();


  const [password, setPassword] = React.useState("");


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
      paddingVertical: 20, // Added spacing between elements
    },
    contentContainer: {
      paddingHorizontal: 20,
    },
    footerPart: {
      flexDirection: 'flex-end',
    },
    reminderContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      marginBottom: 15,
      spacing: 10,
    },
    reminderText: {
      fontSize: theme.fontSizes.medium,
      color: theme.colors.yellow_light,
      paddingHorizontal: 10,
    },
  });

  const handleDeleteProfile = async () => {
    try {
      const response = await deleteProfile(password);
      if (response.content) {
        logout();
      }
    } catch (error) {
      showAlert('Error', error.message);
    }
  };


  const handlePasswordChange = useCallback(
    (text) => setPassword(text),
    [],
  );



  return (
    <CustomSafeView scrollable keyboardShouldPersistTaps="handled">
      <SpacingView style={styles.contentWrapper}>
        <CustomTextInput
          placeholder="Password"
          onChangeText={handlePasswordChange}
          secureTextEntry={true}
          value={password}
        />

        <NormalButton
          text={isLoading ? 'Loading...' : 'Delete Profile'}
          onPress={handleDeleteProfile}
          disabled={isLoading}
          colorType="red"
          style={{ backgroundColor: theme.colors.red }} // Button background color
        />
      </SpacingView>
      <SpacingView spacing="large" style={styles.footerPart}>
        <TextLink text="Update Profile" onPress={() => navigation.goBack()} />
      </SpacingView>
    </CustomSafeView>
  );
};

export default DeleteProfileScreen;
