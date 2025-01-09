import { useNavigation } from '@react-navigation/native';
import { Asset } from 'expo-asset';
import React, { useCallback, useEffect } from 'react';
import {
  Image,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NormalButton from 'src/components/buttons/NormalButton';
import TextLink from 'src/components/buttons/TextLink';
import MainTitle from 'src/components/common/MainTitle';
import CustomTextInput from 'src/components/forms/CustomTextInput';
import CustomSafeView from 'src/components/layouts/CustomSafeArea';
import SpacingView from 'src/components/layouts/SpacingView';
import { useLogin } from 'src/hooks/useLogin';
import { showAlert } from 'src/utils/alert';

const LoginScreen = () => {
  const navigation = useNavigation();
  const { login, isLoading, error } = useLogin();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [imageError, setImageError] = React.useState(false);

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
  });

  // Preload the image
  useEffect(() => {
    Asset.fromModule(require('../../.../assets/icons/Logo_Violet.png'))
      .downloadAsync()
      .catch((error) => {
        console.error('Failed to preload logo:', error);
        setImageError(true);
      });
  }, []);

  const handleLogin = async () => {
    try {
      let response = await login(username, password);

      if (response.content.activated === false) {
        console.log(response.content);
        navigation.navigate('Activation', { userId: response.content.userId });
      }
    } catch (error) {
      showAlert('Error', error.message || 'An unexpected error occurred');
    }
  };

  const handleUsernameChange = useCallback((text) => setUsername(text), []);
  const handlePasswordChange = useCallback((text) => setPassword(text), []);

  return (
    <CustomSafeView scrollable keyboardShouldPersistTaps="handled">
      <View style={styles.logoContainer}>
        <TouchableOpacity onPress={() => Linking.openURL('https://weeki.ai')}>
          {!imageError && (
            <Image
              source={require('../../../assets/icons/Logo_Violet.png')}
              style={styles.mainLogo}
              onError={(error) => {
                console.error('Image loading error:', error.nativeEvent.error);
                setImageError(true);
              }}
            />
          )}
        </TouchableOpacity>
      </View>
      <SpacingView style={styles.contentWrapper}>
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
          text={isLoading ? 'Loading...' : 'Login'}
          onPress={handleLogin}
          disabled={isLoading}
        />
      </SpacingView>
      <SpacingView spacing="large" style={styles.footerPart}>
        <TextLink
          text="Sign Up"
          onPress={() => navigation.navigate('Register')}
        />
        <TextLink
          text="Forgot Password"
          onPress={() => navigation.navigate('ForgotPassword')}
        />
      </SpacingView>
    </CustomSafeView>
  );
};

export default LoginScreen;
