import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import BackHeader from 'src/components/common/BackHeader';
import { useUserContext } from 'src/hooks/useUserContext';
import DashboardScreen from './DashboardScreen';
import EditProfileView from './EditProfileView';
import TopicReflectionView from './TopicReflectionView';

const DashboardStack = createStackNavigator();

function DashboardStackScreen() {

  const { theme } = useUserContext();
  return (
    <DashboardStack.Navigator
      screenOptions={{
        headerMode: 'screen',
        presentation: 'card',
        headerStyle: {
          backgroundColor: theme.colors.background,
          // Remove header border/shadow
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTintColor: theme.colors.onBackground,
        // Remove default back button completely
        headerBackVisible: false,
        // Remove back button title
        headerBackTitleVisible: false,


        headerTitle: '',
      }}
    >
      <DashboardStack.Screen
        name="DashboardMain"
        component={DashboardScreen}
        options={{
          headerShown: false,
        }}
      />
      <DashboardStack.Screen
        name="TopicReflectionView"
        component={TopicReflectionView}
      />
      <DashboardStack.Screen name="EditProfile" component={EditProfileView} />
    </DashboardStack.Navigator>
  );
}

export default DashboardStackScreen;
