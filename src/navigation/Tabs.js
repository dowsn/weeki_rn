import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  getFocusedRouteNameFromRoute,
  useNavigation,
} from '@react-navigation/native';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomSafeView from 'src/components/layouts/CustomSafeArea';
import TabScreen from 'src/components/layouts/TabScreen';
import { useUserContext } from 'src/hooks/useUserContext';
import ProfileHeader from '../components/common/ProfileHeader';
import ChatScreen from '../screens/Record/ChatScreen';
import SpeechScreen from '../screens/Record/SpeechScreen';
import WriteScreen from '../screens/Record/WriteScreen';
import ReflectStackScreen from '../screens/Reflect/ReflectStackScreen';
import WeekStack from '../screens/Review/WeekScreen/WeekScreen';

const Tab = createBottomTabNavigator();
const SCREEN_HEIGHT = Dimensions.get('window').height;

const tabIcons = {
  Reflect: require('assets/icons/Reflect.png'),
  Record: require('assets/icons/Record.png'),
  Review: require('assets/icons/Review.png'),
};

// Wrapper component for WriteScreen that covers the entire screen
const FullScreenWrite = () => {
  const { theme } = useUserContext();

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView
        edges={['top']}
        style={{
          backgroundColor: theme.colors.background,
          flex: 0,
        }}
      />
      <SafeAreaView
        edges={['left', 'right']} // Removed 'bottom' to prevent double padding
        style={{
          flex: 1,
          backgroundColor: theme.colors.dark,
        }}
      >
        <ChatScreen />
      </SafeAreaView>
    </View>
  );
};

const Tabs = () => {
  const { theme } = useUserContext();

    const navigation = useNavigation();


  const styles = StyleSheet.create({
    selectedTab: {
      tintColor: theme.colors.light,
    },
    unselectedTab: {
      tintColor: theme.colors.gray,
    },

    focusedTab: {
      // Styles for focused state
    },
    tabText: {
      fontSize: theme.fontSizes.middle,
      marginTop: theme.spacing.small,
    },
    selectionIndicator: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 4,
      backgroundColor: theme.colors.light,
    },
    tabItem: {
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      width: '100%',
      paddingBottom: 80, // Adjusted this
    },
    tabBar: {
      backgroundColor: theme.colors.dark,
      height: 80,
      fontSize: theme.fontSizes.large,
      borderTopWidth: 0,
      borderBottomWidth: 0,
      paddingBottom: 0, // Changed from theme.spacing.medium
    },
  });

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: theme.colors.light,
        tabBarInactiveTintColor: theme.colors.gray,
        tabBarStyle: [
          styles.tabBar,
          // Hide the tab bar for the Record tab
          route.name === 'Record' && { display: 'none' },
        ],
        animationEnabled: true,
      })}
    >
      <Tab.Screen
        name="Reflect"
        component={ReflectStackScreen}
        options={{
          tabBarButton: () => null,
          header: () => <ProfileHeader navigation={navigation} />,
        }}
      />
      {['Record'].map((tabName, index) => (
        <Tab.Screen
          key={tabName}
          name={tabName}
          component={
            tabName === 'Reflect'
              ? ReflectStackScreen
              : tabName === 'Record'
                ? FullScreenWrite // Use the wrapper component instead of WriteScreen directly
                : TabScreen
          }
          options={({ route }) => ({
            animationEnabled: true,
            lazy: false,
            tabBarLabel: () => null, // Add this line

            tabBarShowLabel: false,
            header: () => {
              return route.name !== 'Record' ? (
                <ProfileHeader navigation={navigation} />
              ) : null;
            },
            tabBarIcon: ({ focused, color, size }) => {
              const itemColor = focused
                ? theme.colors.light
                : theme.colors.green;

              return (
                <View style={[styles.tabItem, focused && styles.focusedTab]}>
                  <Image
                    source={tabIcons[tabName]}
                    style={{
                      width: size + 80,
                      height: size + 80,
                      tintColor: itemColor,
                    }}
                  />

                  {focused && <View style={styles.selectionIndicator} />}
                </View>
              );
            },
          })}
        />
      ))}
    </Tab.Navigator>
  );
};

export default Tabs;
