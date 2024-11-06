import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TabScreen from 'src/components/layouts/TabScreen';
import { useUserContext } from 'src/hooks/useUserContext';
import BackHeader from '../components/common/BackHeader';
import ProfileHeader from '../components/layouts/ProfileHeader';
import ChatScreen from '../screens/Create/ChatScreen';
import SpeechScreen from '../screens/Create/SpeechScreen';
import WriteScreen from '../screens/Create/WriteScreen';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import DashboardStackScreen from '../screens/Dashboard/DashboardStackScreen';
import WeekStack from '../screens/Dashboard/WeekScreen/WeekScreen';

const Tab = createBottomTabNavigator();
const SCREEN_HEIGHT = Dimensions.get('window').height;

const tabIcons = {
  Reflect: require('assets/icons/Reflect.png'),
  Record: require('assets/icons/Record.png'),
  Review: require('assets/icons/Review.png'),
};

// Wrapper component for WriteScreen that covers the entire screen
const FullScreenWrite = () => {
  return (
    <View style={{ height: SCREEN_HEIGHT, backgroundColor: '#fff' }}>
      <WriteScreen />
    </View>
  );
};

const Tabs = () => {
  const { theme } = useUserContext();

  const styles = StyleSheet.create({
    selectedTab: {
      tintColor: theme.colors.light,
    },
    unselectedTab: {
      tintColor: theme.colors.gray,
    },
    tabItem: {
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      width: '100%',
      paddingTop: 8,
      paddingBottom: 4,
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
    tabBar: {
      backgroundColor: theme.colors.dark,
      height: 80,
      fontSize: theme.fontSizes.large,
      borderTopWidth: 0,
      borderBottomWidth: 0,
      paddingBottom: theme.spacing.medium,
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
      {['Reflect', 'Record', 'Review'].map((tabName, index) => (
        <Tab.Screen
          key={tabName}
          name={tabName}
          component={
            tabName === 'Reflect'
              ? DashboardStackScreen
              : tabName === 'Record'
                ? FullScreenWrite // Use the wrapper component instead of WriteScreen directly
                : TabScreen
          }
          options={({ route }) => ({
            animationEnabled: true,
            lazy: false,
            tabBarShowLabel: false,
            header: () => {
              // Hide header for Record screen
              return tabName === 'Record' ? null : <ProfileHeader />;
            },
            tabBarIcon: ({ focused, color, size }) => {
              const itemColor =
                index === 1
                  ? focused
                    ? theme.colors.light
                    : theme.colors.green
                  : focused
                    ? theme.colors.light
                    : theme.colors.gray;

              return (
                <View style={[styles.tabItem, focused && styles.focusedTab]}>
                  <Image
                    source={tabIcons[tabName]}
                    style={{
                      width: size,
                      height: size,
                      tintColor: itemColor,
                    }}
                  />
                  <Text style={[styles.tabText, { color: itemColor }]}>
                    {tabName}
                  </Text>
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
