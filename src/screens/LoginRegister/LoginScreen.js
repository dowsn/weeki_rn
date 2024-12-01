import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { Linking, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NormalButton from 'src/components/buttons/NormalButton';
import TextLink from 'src/components/buttons/TextLink';
import MainTitle from 'src/components/common/MainTitle';
import CustomTextInput from 'src/components/forms/CustomTextInput';
import CustomSafeView from 'src/components/layouts/CustomSafeArea';
import SpacingView from 'src/components/layouts/SpacingView';
import { useLogin } from 'src/hooks/useLogin';
import { showAlert } from 'src/utils/alert';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },

});

const LoginScreen = () => {
  const navigation = useNavigation();
  const { login, isLoading } = useLogin();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = async () => {
    try {
      await login(username, password);
    } catch (error) {
      showAlert('Login Error', error.message || 'An unexpected error occurred');
    }
  };

  const handleUsernameChange = useCallback((text) => setUsername(text), []);
  const handlePasswordChange = useCallback((text) => setPassword(text), []);

  return (
    <CustomSafeView scrollable keyboardShouldPersistTaps="handled">
      <MainTitle title="Welcome to weeki" />

      <SpacingView style={styles.container}>
        <CustomTextInput
          placeholder="Username"
          onChangeText={handleUsernameChange}
          value={username}
        />
        <CustomTextInput
          placeholder="Password"
          onChangeText={handlePasswordChange}
          value={password}
          secureTextEntry
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
          Linking.openURL('https://www.example.com').catch(console.error)
        }
      />
    </CustomSafeView>
  );
};

export default LoginScreen;
