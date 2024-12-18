// App.js
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { registerRootComponent } from 'expo';
import React from 'react';
import { View } from 'react-native';
import ProfileHeader from 'src/components/common/ProfileHeader';
import WeekiLoading from 'src/components/common/WeekiLoading';
import { UserProvider } from 'src/contexts/UserContext';
import { useUserContext } from 'src/hooks/useUserContext';
import ChatScreen from 'src/screens/Record/ChatScreen';
import EditProfileView from 'src/screens/Reflect/EditProfileView';
import ReflectScreen from 'src/screens/Reflect/ReflectScreen';
import ReflectStackScreen from 'src/screens/Reflect/ReflectStackScreen';
import AuthStack from 'src/stacks/AuthStack';

const Stack = createStackNavigator();
const RootStack = createStackNavigator();

const RootNavigator = () => {
  const { user, loading } = useUserContext();

  if (loading) return <WeekiLoading />;

  return (
    <RootStack.Navigator>
      {!user.tokens?.access ? (
        <RootStack.Screen
          name="Auth"
          component={AuthStack}
          options={{ headerShown: false }}
        />
      ) : (
        <RootStack.Screen
          name="Main"
          component={MainStack}
          options={{ headerShown: false }}
        />
      )}
    </RootStack.Navigator>
  );
};

const App = () => (
  <UserProvider>
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  </UserProvider>
);

const HeaderWrapper = ({ children, navigation }) => {
  const { theme } = useUserContext();
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.violet_darkest }}>
      <ProfileHeader navigation={navigation} />
      {children}
    </View>
  );
};

const ProtectedRouteWithHeader = ({ children, navigation }) => {
  const { user, loading } = useUserContext();

  if (loading) return <WeekiLoading />;
  if (!user.tokens?.access) return <AuthStack />;

  return <HeaderWrapper navigation={navigation}>{children}</HeaderWrapper>;
};

const MainStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Reflect" options={{ headerShown: false }}>
      {(props) => (
        <ProtectedRouteWithHeader {...props}>
          <ReflectStackScreen {...props} />
        </ProtectedRouteWithHeader>
      )}
    </Stack.Screen>
    <Stack.Screen
      name="Chat"
      component={ChatScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="EditProfileView" options={{ headerShown: false }}>
      {(props) => (
        // <ProtectedRouteWithHeader {...props}>
          <EditProfileView {...props} />
        // </ProtectedRouteWithHeader>
      )}
    </Stack.Screen>
  </Stack.Navigator>
);

registerRootComponent(App);


export default App;