import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { useUserContext } from 'src/hooks/useUserContext';
import OldSessionDetailScreen from 'src/screens/OldSessions/OldSessionDetailScreen';
import OldSessionsScreen from 'src/screens/OldSessions/OldSessionsScreen';
import OldSessionsSelectScreen from 'src/screens/OldSessions/OldSessionsSelectScreen';
import PastChatScreen from 'src/screens/OldSessions/PastChatScreen';
import SimpleTextScreen from 'src/screens/Universal/SimpleTextScreen';

const Stack = createStackNavigator();

function OldSessionsStack() {
  const { theme } = useUserContext();
  return (
    <Stack.Navigator
      screenOptions={{
        headerMode: 'screen',
        presentation: 'card',
        headerStyle: {
          backgroundColor: theme.colors.background,
          // Remove header border/shadow
          shadowColor: 'transparent',
          // elevation: 0,
        },
        headerTintColor: theme.colors.onBackground,
        // Remove default back button completely
        headerBackVisible: false,
        // Remove back button title
        headerBackTitleVisible: false,

        headerTitle: '',
      }}
    >
      <Stack.Screen
        name="Browser"
        component={OldSessionsScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Summary"
        component={SimpleTextScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Chat"
        component={PastChatScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Select"
        component={OldSessionsSelectScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default OldSessionsStack;
