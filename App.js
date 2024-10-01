// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from '@react-navigation/native';
// import {
//   createStackNavigator,
//   TransitionPresets,
// } from "@react-navigation/stack";
import React from 'react';
import { UserProvider } from './src/contexts/UserContext';
// import CitySelectorView from "./src/components/main/CitySelectorView";
import Tabs from './src/navigation/Tabs';

// import "react-native-gesture-handler";

// const Tab = createBottomTabNavigator();
// const MainStack = createStackNavigator(); // Create a new stack navigator

// function MainStackScreen() {
//   return (
//     <MainStack.Navigator
//       screenOptions={{
//         headerShown: false,
//       }}
//     >
//       <MainStack.Screen name="Tabs" component={Tabs} />
//       <MainStack.Screen
//         name="CitySelectorView"
//         component={CitySelectorView}
//         options={{
//           ...TransitionPresets.SlideFromRightIOS,
//         }}
//       />
//     </MainStack.Navigator>
//   );
// }

const App = () => {
  return (
    <UserProvider>
      <NavigationContainer>
        <Tabs />
      </NavigationContainer>
    </UserProvider>
  );
};

export default App;