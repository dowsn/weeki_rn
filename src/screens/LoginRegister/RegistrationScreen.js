// RegistrationScreen.js
import { useNavigation } from '@react-navigation/native';
// useRegistration.js
import React, { useCallback, useState } from 'react';
import {
  Image,
  Linking,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NormalButton from 'src/components/buttons/NormalButton';
import TextLink from 'src/components/buttons/TextLink';
import MainTitle from 'src/components/common/MainTitle';
import { Text } from 'src/components/common/Text';
import CustomTextInput from 'src/components/forms/CustomTextInput';
import CustomSafeView from 'src/components/layouts/CustomSafeArea';
import SpacingView from 'src/components/layouts/SpacingView';
import { useRegistration } from 'src/hooks/useRegistration';
import { useUserContext } from 'src/hooks/useUserContext';
import { showAlert } from 'src/utils/alert';

const RegistrationScreen = () => {
  const { theme } = useUserContext();
  const navigation = useNavigation();
  const { register, isLoading, error } = useRegistration();
  const [emailReminders, setEmailReminders] = useState(true);

  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

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

  const handleRegistration = async () => {
    try {
      console.log('🔍 REGISTRATION SCREEN: Starting registration...');
      const response = await register(
        username,
        password,
        email,
        emailReminders,
      );
      console.log('🔍 REGISTRATION SCREEN: Register response:', response);
      console.log('🔍 REGISTRATION SCREEN: response.content (userId):', response.content);
      
      if (response.content) {
        console.log('🔍 REGISTRATION SCREEN: Navigating to Activation with userId:', response.content);
        navigation.navigate('Activation', { userId: response.content });
        console.log('🔍 REGISTRATION SCREEN: Navigation completed');
      } else {
        console.log('❌ REGISTRATION SCREEN: No content in response, not navigating');
      }
    } catch (error) {
      console.error('❌ REGISTRATION SCREEN: Error occurred:', error);
      // Error is handled in the hook
      showAlert('Error', error.message);
    }
  };

  const handleNameChange = useCallback((text) => setUsername(text), []);
  const handleEmailChange = useCallback((text) => setEmail(text), []);
  const handlePasswordChange = useCallback((text) => setPassword(text), []);
  const handleEmailRemindersChange = useCallback((value) => setEmailReminders(value), []);


  return (
    <CustomSafeView scrollable keyboardShouldPersistTaps="handled">
      <SpacingView style={styles.contentWrapper}>
        <CustomTextInput
          placeholder="Username"
          onChangeText={handleNameChange}
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
          placeholder="Password"
          onChangeText={handlePasswordChange}
          value={password}
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
          text={isLoading ? 'Registering...' : 'Register'}
          onPress={handleRegistration}
          disabled={isLoading}
        />
      </SpacingView>
      <SpacingView spacing="large" style={styles.footerPart}>
        <TextLink
          text="Already have an account? Login"
          onPress={() => navigation.navigate('Login')}
        />
      </SpacingView>
    </CustomSafeView>
  );
};

export default RegistrationScreen;
