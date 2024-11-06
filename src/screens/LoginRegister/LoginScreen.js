import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useContext, useRef, useState } from 'react';
import {
  Alert,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NormalButton from 'src/components/buttons/NormalButton';
import TextLink from 'src/components/buttons/TextLink';
import FlexSpacer from 'src/components/common/FlexSpacer';
import MainTitle from 'src/components/common/MainTitle';
import CustomTextInput from 'src/components/forms/CustomTextInput';
import CustomSafeView from 'src/components/layouts/CustomSafeArea';
import SpacingView from 'src/components/layouts/SpacingView';
import { www } from 'src/constants/constants';
import { UserContext } from 'src/contexts/UserContext';
import { useLogin } from 'src/hooks/useLogin'; // Import the new useLogin hook
import { useUserContext } from 'src/hooks/useUserContext';
import { createStyles } from 'src/styles';
import { showAlert } from 'src/utils/alert';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import RegistrationScreen from './RegistrationScreen';

const LoginScreen = () => {
  const { setUser } = useUserContext();
  const { login, isLoading, error } = useLogin();
  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Use separate state variables and memoized handlers
  const handleUsernameChange = useCallback((text) => {
    setUsername(text);
  }, []);

  const handlePasswordChange = useCallback((text) => {
    setPassword(text);
  }, []);

  const handleLogin = async () => {
    try {
      const response = await login(username, password);

      if (response.error) {
        showAlert('Login Error', response.message);
      } else {
        setUser(response.content);
      }
    } catch (error) {
      showAlert('Login Error', error.message || 'An unexpected error occurred');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    },
  });

  return (
    <CustomSafeView scrollable keyboardShouldPersistTaps="handled">
      <MainTitle title="Welcome to weeki" />

      <SpacingView style={styles.container}>
        <CustomTextInput
          placeholder="Username"
          onChangeText={setUsername}
          value={username}
          secureTextEntry={false}
        />
        <CustomTextInput
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
          secureTextEntry={true}
        />
        <NormalButton
          text={isLoading ? 'Logging in...' : 'Login'}
          onPress={handleLogin}
          disabled={isLoading}
        />
      </SpacingView>
      <TextLink
        text="Don't have an account? Sign Up"
        onPress={() => navigation.navigate('Register')}
      />
      <TextLink
        text="Forgot Password?"
        onPress={() => navigation.navigate('ForgotPassword')}
      />
      <TextLink
        text="Visit our website"
        onPress={() =>
          Linking.openURL('https://www.example.com').catch((err) =>
            console.error('An error occurred', err),
          )
        }
      />
    </CustomSafeView>
  );
};


export default LoginScreen;
