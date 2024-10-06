import React, { useContext, useState } from 'react';
import {
  Alert,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomTextInput from 'src/components/forms/CustomTextInput';
import { UserContext } from 'src/contexts/UserContext';
import { useLogin } from 'src/hooks/useLogin'; // Import the new useLogin hook
import { useUserContext } from 'src/hooks/useUserContext';

const LoginScreen = () => {
  const { setUser, theme } = useUserContext(UserContext);
  const { login, isLoading, error } = useLogin(); // Use the new useLogin hook
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await login(username, password);
      // Assuming the response includes a userId, update the user context
      setUser((prevUser) => ({ ...prevUser, userId: response.content }));
      // You might want to navigate to another screen here
      Alert.alert('Success', 'Login successful!');
    } catch (err) {
      Alert.alert('Error', error);
    }
  };

  const handleRegister = () => {
    // Implement your registration logic here
    // For now, we'll just set a dummy user ID
    setUser((prevUser) => ({ ...prevUser, userId: '1' }));
  };

  const handleWebsiteLink = () => {
    Linking.openURL('https://your-website-url.com');
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>Welcome</Text>
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
      <TouchableOpacity
        style={[styles.button, isLoading && styles.disabledButton]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <TouchableOpacity style={styles.smallButton} onPress={handleRegister}>
        <Text style={styles.smallButtonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.smallButton} onPress={handleWebsiteLink}>
        <Text style={styles.smallButtonText}>Visit Website</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#A0A0A0',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  smallButton: {
    marginTop: 10,
  },
  smallButtonText: {
    color: '#007AFF',
    fontSize: 14,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default LoginScreen;
