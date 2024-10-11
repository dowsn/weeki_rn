import { createStackNavigator } from '@react-navigation/stack';
import ForgotPasswordScreen from 'src/screens/LoginRegister/ForgotPasswordScreen';
import LoginScreen from 'src/screens/LoginRegister/LoginScreen';
import RegisterScreen from 'src/screens/LoginRegister/RegistrationScreen';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
          headerTitle: 'Sign In',
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          headerShown: true,
          headerTitle: 'Sign Up',
        }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{
          headerShown: true,
          headerTitle: 'Forgot Password',
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
