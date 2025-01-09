import { useNavigation, useRoute } from '@react-navigation/native';
import { Asset } from 'expo-asset';
import React, { useCallback, useEffect } from 'react';
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import NormalButton from 'src/components/buttons/NormalButton';
import TextLink from 'src/components/buttons/TextLink';
import MainTitle from 'src/components/common/MainTitle';
import CustomTextInput from 'src/components/forms/CustomTextInput';
import CustomSafeView from 'src/components/layouts/CustomSafeArea';
import SpacingView from 'src/components/layouts/SpacingView';
import { useActivation } from 'src/hooks/useActivation';
import { useUserContext } from 'src/hooks/useUserContext';
import { showAlert } from 'src/utils/alert';

const ActivationScreen = () => {
  const { theme } = useUserContext();
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;

  const { activate, sendEmail, isLoading, error } = useActivation();
  const [activationCode, setActivationCode] = React.useState('');
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
    welcomeText: {
      textAlign: 'center',
      marginBottom: 20,
      fontSize: 16,
    },
    instructionText: {
      textAlign: 'center',
      marginBottom: 30,
      color: theme.colors.yellow_light,
    },
  });

  // Preload the image
  useEffect(() => {
    Asset.fromModule(require('../../../assets/icons/Logo_Violet.png'))
      .downloadAsync()
      .catch((error) => {
        console.error('Failed to preload logo:', error);
        setImageError(true);
      });
  }, []);

  const handleActivation = async () => {
    try {
      await activate(userId, activationCode);
    } catch (error) {
      showAlert('Error', error.message);
    }
  };

  const handleResendCode = useCallback(async () => {
    try {
      console.log('userId', userId);
      let response = await sendEmail(userId);
    } catch (error) {
      showAlert('Error', error.message);
    }
  }, [userId]);

  useEffect(() => {
    handleResendCode();
  }, [handleResendCode]);

  const handleActivationCodeChange = useCallback((text) => {
    setActivationCode(text);
  }, []);

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
        <Text style={styles.instructionText}>
          Please enter the activation code sent to your email address
        </Text>
        <CustomTextInput
          placeholder="Activation Code"
          onChangeText={handleActivationCodeChange}
          value={activationCode}
          maxLength={64}
          textAlign="center"
        />
        <NormalButton
          text={isLoading ? 'Loading...' : 'Activate Account'}
          onPress={handleActivation}
          disabled={isLoading || activationCode.length < 6}
        />
      </SpacingView>
      <SpacingView spacing="large" style={styles.footerPart}>
        <TextLink
          text="Didn't receive the code? Resend"
          onPress={handleResendCode}
        />
        <TextLink
          text="Back to Login"
          onPress={() => navigation.navigate('Login')}
        />
      </SpacingView>
    </CustomSafeView>
  );
};

export default ActivationScreen;
