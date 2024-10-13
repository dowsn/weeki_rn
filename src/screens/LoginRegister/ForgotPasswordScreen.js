import React from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import NormalButton from 'src/components/buttons/NormalButton';
import MainTitle from 'src/components/common/MainTitle';
import CustomTextInput from 'src/components/forms/CustomTextInput';
import CustomSafeView from 'src/components/layouts/CustomSafeArea';
import { useLogin } from 'src/hooks/useLogin'; // Import the new useLogin hook
import { showAlert } from 'src/utils/alert';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = React.useState('');
  const { forgotPassword, isLoading, error } = useLogin();

  const handleResetPassword = async() => {
    const { error, message, content } = await forgotPassword(email);

    if (error) {
      showAlert('Error', message);
    } else {
      setUser(content);
      // can I do it without title
      showAlert('Success', 'Please, check your email.');
    }

  };

  return (
    <CustomSafeView>
      <MainTitle>Forgot Password</MainTitle>
      <CustomTextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <NormalButton title="Reset Password" onPress={handleResetPassword} />
    </CustomSafeView>
  );
};

export default ForgotPasswordScreen;