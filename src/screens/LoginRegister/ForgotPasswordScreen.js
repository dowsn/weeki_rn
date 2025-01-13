import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import {
  Image,
  Linking,
  StyleSheet,
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
import { useForgotPassword } from 'src/hooks/useForgotPassword';
import { useUserContext } from 'src/hooks/useUserContext';
import { showAlert } from 'src/utils/alert';

const ForgotPasswordScreen = () => {
  const { theme } = useUserContext();
  const navigation = useNavigation();
  const { resetPassword, isLoading, error } = useForgotPassword();
  const [email, setEmail] = React.useState('');

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
    instructionText: {
      textAlign: 'center',
      marginBottom: 30,
      color: theme.colors.yellow_light,
    },
  });

  const handleResetPassword = async () => {
    try {
      const response = await resetPassword(email);
      if (response.content) {
        // Navigate back to login after a short delay to allow user to read the message
        // showAlert('Success', response.message);
        // setTimeout(() => {
          navigation.navigate('Login');
        // }, 2000);
      }
    } catch (error) {
        showAlert('Error', error.message);
      // Error is handled in the hook
    }
  };

  const handleEmailChange = useCallback((text) => {
    setEmail(text.trim().toLowerCase());
  }, []);

  const isValidEmail = email.includes('@') && email.includes('.');

  return (
    <CustomSafeView scrollable keyboardShouldPersistTaps="handled">
      <SpacingView style={styles.contentWrapper}>
        <Text style={styles.instructionText}>
          Enter your email address and we'll send you instructions to reset your
          password
        </Text>
        <CustomTextInput
          placeholder="Email"
          onChangeText={handleEmailChange}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <NormalButton
          text={isLoading ? 'Sending...' : 'Reset Password'}
          onPress={handleResetPassword}
          disabled={isLoading || !isValidEmail}
        />
      </SpacingView>
      <SpacingView spacing="large" style={styles.footerPart}>
        <TextLink
          text="Back to Login"
          onPress={() => navigation.navigate('Login')}
        />
      </SpacingView>
    </CustomSafeView>
  );
};

export default ForgotPasswordScreen;
