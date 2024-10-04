import React, { useContext } from 'react';
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { UserContext } from 'src/contexts/UserContext';

const LoginScreen = () => {
  const { setUser, theme } = useContext(UserContext);

  const handleLogin = () => {
    // Implement your login logic here
    // For now, we'll just set a dummy user ID
    setUser((prevUser) => ({ ...prevUser, userId: '1' }));
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
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleWebsiteLink}>
        <Text style={styles.buttonText}>Visit Website</Text>
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
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default LoginScreen;
