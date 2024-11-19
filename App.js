import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import WeekiLoading from 'src/components/common/WeekiLoading';
import { UserProvider } from 'src/contexts/UserContext';
import { useUserContext } from 'src/hooks/useUserContext';
import Tabs from 'src/navigation/Tabs';
import EditProfileView from 'src/screens/Reflect/EditProfileView';
import AuthStack from 'src/stacks/AuthStack';

const Stack = createStackNavigator();

// Create a wrapper component for the main app flow
const MainStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={Tabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditProfileView"
        component={EditProfileView}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const MainNavigator = () => {
  const { user, loading } = useUserContext();

  if (loading) {
    return <WeekiLoading />;
  }

  return user.userId !== 0 ? <MainStack /> : <AuthStack />;
};




    //  const logout = async () => {
    //    const defaultUserData = {
    //      userId: 0,
    //      tokens: {
    //        access: null,
    //        refresh: null,
    //      },
    //    };
    //    setUser(defaultUserData);
    //    await storeData('user', defaultUserData, setLoading);
    //  };

    // logout();





const App = () => {
  return (
    <UserProvider>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </UserProvider>
  );
};

export default App;
