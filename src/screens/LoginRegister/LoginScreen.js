import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import {
  Alert,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
import { showAlert } from 'src/utils/alert';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import RegistrationScreen from './RegistrationScreen';

const LoginScreen = () => {
  const { setUser } = useUserContext();
  const { login, isLoading, error } = useLogin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const result = await login(username, password);
      if (result.error) {
        showAlert('Login Error', result.message);
      } else {
        setUser(result.content);
        showAlert('Success', 'Login successful!');
      }
    } catch (error) {
      showAlert('Login Error', error.message || 'An unexpected error occurred');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      // alignItems: 'center',
    }
  }
  );

  return (
    <CustomSafeView>
      <MainTitle title="Welcome to weeki" />
      <SpacingView style={styles.container}>
        <CustomTextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          secureTextEntry={false}
        />
        <CustomTextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
        <NormalButton
          text={isLoading ? 'Logging in...' : 'Login'}
          onPress={handleLogin}
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
