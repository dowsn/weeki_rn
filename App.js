// App.js
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { registerRootComponent } from 'expo';
import { useFonts } from 'expo-font';
import React from 'react';
import { View } from 'react-native';
import { enableScreens } from 'react-native-screens';
import ProfileHeader from 'src/components/common/ProfileHeader';
import WeekiLoading from 'src/components/common/WeekiLoading';
import { UserProvider } from 'src/contexts/UserContext';
import { useUserContext } from 'src/hooks/useUserContext';
import SubscriptionScreen from 'src/screens/You/SubscriptionScreen';
import TopicArchiveScreen from 'src/screens/You/TopicsArchiveScreen';
import AuthStack from 'src/stacks/AuthStack';
import DashboardStack from 'src/stacks/DashboardStack';

enableScreens();

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

const App = () => {
  const [fontsLoaded] = useFonts({
    'VarelaRound-Regular': require('./assets/fonts/VarelaRound-Regular.ttf'),
  });

  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
};

const AppContent = () => {
  const { theme } = useUserContext();

  return (
    <NavigationContainer
      theme={{
        colors: {
          background: theme.colors.violet_darkest,
        },
      }}
    >
      <View style={{ flex: 1, backgroundColor: theme.colors.violet_darkest }}>
        <RootNavigator />
      </View>
    </NavigationContainer>
  );
};

const HeaderWrapper = ({ children, navigation }) => {
  const { theme } = useUserContext();
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.violet_darkest }}>
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
    <Stack.Screen name="Dashboard" options={{ headerShown: false }}>
      {(props) => (
        <ProtectedRouteWithHeader {...props}>
          <DashboardStack {...props} />
        </ProtectedRouteWithHeader>
      )}
    </Stack.Screen>
  </Stack.Navigator>
);

registerRootComponent(App);


export default App;