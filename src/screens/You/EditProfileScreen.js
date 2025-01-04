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

const EditProfileScreen = () => {
  const { theme, user, setUser, logout } = useUserContext();
  const navigation = useNavigation();
  const { updateProfile, deleteProfile, isLoading, error } = useUpdateProfile();

  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [newPassword, setNewPassword] = React.useState(null);
  const [emailReminders, setEmailReminders] = React.useState(false);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
      setEmailReminders(user.reminder || false);
    }
  }, [user]);

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
      height: 140,
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

  const handleUpdateProfile = async () => {
    try {

      const response = await updateProfile(
        username,
        email,
        emailReminders,
        newPassword,
      );

              console.log('response', response);

      if (response.content) {
           setUser({
             ...user,
             username,
             email,
             reminder: emailReminders,
           });
                navigation.goBack();

      }
    } catch (error) {
      showAlert('Error', error.message);
    }
  };


  const handleUsernameChange = useCallback((text) => setUsername(text), []);
  const handleEmailChange = useCallback((text) => setEmail(text), []);
  const handleNewPasswordChange = useCallback(
    (text) => setNewPassword(text),
    [],
  );

  const handleEmailRemindersChange = useCallback(
    (value) => setEmailReminders(value),
    [],
  );


  return (
    <CustomSafeView scrollable keyboardShouldPersistTaps="handled">
      <SpacingView style={styles.contentWrapper}>
        <CustomTextInput
          placeholder="Username"
          onChangeText={handleUsernameChange}
          value={username}
        />
        <CustomTextInput
          placeholder="Email"
          onChangeText={handleEmailChange}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <CustomTextInput
          placeholder="Change Password"
          onChangeText={handleNewPasswordChange}
          value={newPassword}
          secureTextEntry
        />
        <View style={styles.reminderContainer}>
          <Text style={styles.reminderText}>Email Reminders</Text>
          <Switch
            value={emailReminders}
            onValueChange={handleEmailRemindersChange}
            trackColor={{ false: theme.colors.red, true: theme.colors.green }} // Colors for the track/background
            thumbColor={theme.colors.yellow_light} // Color of the circular thumb
            ios_backgroundColor={theme.colors.gray}
          />
        </View>
        <NormalButton
          text={isLoading ? 'Loading...' : 'Update Profile'}
          onPress={handleUpdateProfile}
          disabled={isLoading}
          style={{ backgroundColor: theme.colors.red }} // Button background color
        />
        <NormalButton
          text={'Subscription'}
          colorType="violet"
          onPress={() => navigation.navigate('Subscription')}
        />
      </SpacingView>
      <SpacingView spacing="large" style={styles.footerPart}>
        <TextLink
          text="Delete Profile"
          onPress={() => navigation.navigate('Delete Profile')}
          color={theme.colors.red}
        />
        <TextLink text="Back" onPress={() => navigation.goBack()} />
      </SpacingView>
    </CustomSafeView>
  );
  };


export default EditProfileScreen;
