import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { registerRootComponent } from 'expo';
import { useFonts } from 'expo-font';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { enableScreens } from 'react-native-screens';

enableScreens();
const RootStack = createStackNavigator();

const WeekiLoading = () => (
  <SafeAreaView style={[styles.container, { backgroundColor: 'blue' }]}>
    <Text style={[styles.text, { color: 'white', fontSize: 24 }]}>
      Loading...
    </Text>
  </SafeAreaView>
);

// Simple test screens
const AuthScreen = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: 'lightblue',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Text style={styles.text}>Auth Screen</Text>
  </View>
);

const DashboardScreen = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: 'lightgreen',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Text style={styles.text}>Dashboard Screen</Text>
  </View>
);

const RootNavigator = ({ isAuthenticated, isLoading }) => {
  if (isLoading) {
    return <WeekiLoading />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'green' }}>
      <RootStack.Navigator
        screenOptions={{
          headerTitleStyle: styles.text, // Apply Varela font to headers
        }}
      >
        {!isAuthenticated ? (
          <RootStack.Screen
            name="Auth"
            component={AuthScreen}
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: 'red' },
              headerTintColor: 'white',
            }}
          />
        ) : (
          <RootStack.Screen
            name="Main"
            component={DashboardScreen}
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: 'purple' },
              headerTintColor: 'white',
            }}
          />
        )}
      </RootStack.Navigator>
    </View>
  );
};

const AppContent = ({ isAuthenticated, isLoading }) => {
  return (
    <NavigationContainer>
      <SafeAreaView style={[styles.container, { backgroundColor: 'orange' }]}>
        <RootNavigator
          isAuthenticated={isAuthenticated}
          isLoading={isLoading}
        />
      </SafeAreaView>
    </NavigationContainer>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    'VarelaRound-Regular': require('./assets/fonts/VarelaRound-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: 'yellow' }]}>
        <Text style={[styles.fallbackText, { color: 'black', fontSize: 24 }]}>
          Loading Fonts...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: 'red' }]}>
      <AppContent isAuthenticated={isAuthenticated} isLoading={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: '100%',
    minWidth: '100%',
  },
  text: {
    fontFamily: 'VarelaRound-Regular',
    fontSize: 24,
  },
  // Fallback style for when fonts aren't loaded yet
  fallbackText: {
    fontSize: 24,
  },
});

registerRootComponent(App);
export default App;

// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import { registerRootComponent } from 'expo';
// import { useFonts } from 'expo-font';
// import React from 'react';
// import { StyleSheet, Text, View } from 'react-native';
// import { enableScreens } from 'react-native-screens';
// import { UserProvider } from './src/contexts/UserContext';
// import { useUserContext } from './src/hooks/useUserContext';
// // Import actual stacks
// import AuthStack from './src/stacks/AuthStack';
// import DashboardStack from './src/stacks/DashboardStack';

// enableScreens();
// const RootStack = createStackNavigator();

// // Placeholder for WeekiLoading
// const WeekiLoading = () => (
//   <View style={styles.container}>
//     <Text>Loading...</Text>
//   </View>
// );

// const RootNavigator = () => {
//   const { user, loading } = useUserContext();

//   if (loading) {
//     return <WeekiLoading />;
//   }

//   return (
//     <RootStack.Navigator>
//       {!user.tokens?.access ? (
//         <RootStack.Screen
//           name="Auth"
//           component={AuthStack}
//           options={{ headerShown: false }}
//         />
//       ) : (
//         <RootStack.Screen
//           name="Main"
//           component={DashboardStack}
//           options={{ headerShown: false }}
//         />
//       )}
//     </RootStack.Navigator>
//   );
// };

// const AppContent = () => {
//   const { theme } = useUserContext();

//   return (
//     <NavigationContainer
//       theme={{
//         colors: {
//           background: theme.colors.violet_darkest,
//         },
//       }}
//     >
//       <View style={{ flex: 1, backgroundColor: theme.colors.violet_darkest }}>
//         <RootNavigator />
//       </View>
//     </NavigationContainer>
//   );
// };

// const App = () => {
//   const [fontsLoaded] = useFonts({
//     'VarelaRound-Regular': require('./assets/fonts/VarelaRound-Regular.ttf'),
//   });

//   if (!fontsLoaded) {
//     return <WeekiLoading />;
//   }

//   return (
//     <UserProvider>
//       <AppContent />
//     </UserProvider>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   text: {
//     fontSize: 24,
//     marginVertical: 10,
//   },
// });

// registerRootComponent(App);

// export default App;

// // App.js
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import { registerRootComponent } from 'expo';
// import { useFonts } from 'expo-font';
// import React from 'react';
// import { View } from 'react-native';
// import { enableScreens } from 'react-native-screens';
// import ProfileHeader from 'src/components/common/ProfileHeader';
// import WeekiLoading from 'src/components/common/WeekiLoading';
// import { UserProvider } from 'src/contexts/UserContext';
// import { useUserContext } from 'src/hooks/useUserContext';
// import SubscriptionScreen from 'src/screens/You/SubscriptionScreen';
// import TopicArchiveScreen from 'src/screens/You/TopicsArchiveScreen';
// import AuthStack from 'src/stacks/AuthStack';
// import DashboardStack from 'src/stacks/DashboardStack';

// enableScreens();

// const Stack = createStackNavigator();
// const RootStack = createStackNavigator();

// const RootNavigator = () => {
//   const { user, loading } = useUserContext();

//   if (loading) return <WeekiLoading />;

//   return (
//     <RootStack.Navigator>
//       {!user.tokens?.access ? (
//         <RootStack.Screen
//           name="Auth"
//           component={AuthStack}
//           options={{ headerShown: false }}
//         />
//       ) : (
//         <RootStack.Screen
//           name="Main"
//           component={MainStack}
//           options={{ headerShown: false }}
//         />
//       )}
//     </RootStack.Navigator>
//   );
// };

// const App = () => {
//   const [fontsLoaded] = useFonts({
//     'VarelaRound-Regular': require('./assets/fonts/VarelaRound-Regular.ttf'),
//   });

//   return (
//     <UserProvider>
//       <AppContent />
//     </UserProvider>
//   );
// };

// const AppContent = () => {
//   const { theme } = useUserContext();

//   return (
//     <NavigationContainer
//       theme={{
//         colors: {
//           background: theme.colors.violet_darkest,
//         },
//       }}
//     >
//       <View style={{ flex: 1, backgroundColor: theme.colors.violet_darkest }}>
//         <RootNavigator />
//       </View>
//     </NavigationContainer>
//   );
// };

// const HeaderWrapper = ({ children, navigation }) => {
//   const { theme } = useUserContext();
//   return (
//     <View style={{ flex: 1, backgroundColor: theme.colors.violet_darkest }}>
//       {children}
//     </View>
//   );
// };

// const ProtectedRouteWithHeader = ({ children, navigation }) => {
//   const { user, loading } = useUserContext();

//   if (loading) return <WeekiLoading />;
//   if (!user.tokens?.access) return <AuthStack />;

//   return <HeaderWrapper navigation={navigation}>{children}</HeaderWrapper>;
// };

// const MainStack = () => (
//   <Stack.Navigator>
//     <Stack.Screen name="Dashboard" options={{ headerShown: false }}>
//       {(props) => (
//         <ProtectedRouteWithHeader {...props}>
//           <DashboardStack {...props} />
//         </ProtectedRouteWithHeader>
//       )}
//     </Stack.Screen>
//   </Stack.Navigator>
// );

// registerRootComponent(App);

// export default App;
