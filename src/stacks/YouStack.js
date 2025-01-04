import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import BackHeader from 'src/components/common/BackHeader';
import { useUserContext } from 'src/hooks/useUserContext';
import EditProfileScreen from 'src/screens/You/EditProfileScreen';
import TopicsArchiveScreen from 'src/screens/You/TopicsArchiveScreen';
import DeleteProfileScreen from '../screens/You/DeleteProfileScreen';
import SubscriptionScreen from '../screens/You/SubscriptionScreen';
import YouScreen from '../screens/You/YouScreen';

const Stack = createStackNavigator();

function YouStack() {
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
        name="You"
        component={YouScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TopicsArchive"
        component={TopicsArchiveScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Subscribe"
        component={SubscriptionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Delete Profile"
        component={DeleteProfileScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default YouStack;
