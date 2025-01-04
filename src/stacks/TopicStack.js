import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { useUserContext } from 'src/hooks/useUserContext';
import CharacterScreen from 'src/screens/Topics/CharacterScreen';
import TopicDetailScreen from 'src/screens/Topics/TopicDetailScreen';
import TopicsOverviewScreen from 'src/screens/Topics/TopicsOverviewScreen';
import SimpleTextScreen from 'src/screens/Universal/SimpleTextScreen';

const Stack = createStackNavigator();

function TopicsStack() {
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
        name="Overview"
        component={TopicsOverviewScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Character"
        component={SimpleTextScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TopicDetail"
        component={SimpleTextScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default TopicsStack;
