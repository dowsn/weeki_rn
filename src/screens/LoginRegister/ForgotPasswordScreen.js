import React from 'react';
import { Button, Text, TextInput, View } from 'react-native';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = React.useState('');

  const handleResetPassword = () => {
    // Implement your password reset logic here
  };

  return (
    <View>
      <Text>Forgot Password</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <Button title="Reset Password" onPress={handleResetPassword} />
    </View>
  );
};

export default ForgotPasswordScreen;