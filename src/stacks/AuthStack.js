import { createStackNavigator } from '@react-navigation/stack';
import ActivationScreen from 'src/screens/LoginRegister/ActivationScreen';
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
        }}
      />
      <Stack.Screen
        name="Activation"
        component={ActivationScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
