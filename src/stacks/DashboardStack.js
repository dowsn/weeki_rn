import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { useUserContext } from 'src/hooks/useUserContext';
import ChatScreen from 'src/screens/Chat/ChatScreen';
import DebugChatScreen from 'src/screens/Chat/DebugChatScreen';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import OldSessionsStack from './OldSessionsStack';
import TopicsStack from './TopicStack';
import YouStack from './YouStack';

const Stack = createStackNavigator();

function DashboardStack() {
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
        name="Focusboard"
        component={DashboardScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="You"
        component={YouStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Topics"
        component={TopicsStack}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="OldSessions"
        component={OldSessionsStack}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default DashboardStack;
