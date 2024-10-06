import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackHeader from '../components/common/BackHeader';
import ChatScreen from '../screens/Create/ChatScreen';
import DashboardScreen from '../screens/Dashboard/DashboardScreen/DashboardScreen';
import WeekStack from '../screens/Dashboard/WeekScreen/WeekScreen';

const Tab = createBottomTabNavigator();

const Tabs = ({ user }) => {
  const { selectedTab, unselectedTab } = styles;

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'grey',
        tabBarStyle: {
          backgroundColor: 'black',
        },
        animationEnabled: true,
      }}
    >
      <Tab.Screen
        name={'Dashboard'}
        component={WeekStack}
        options={({ route }) => ({
          animationEnabled: true,
          lazy: false,
          tabBarShowLabel: false,
          header: () => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? 'FeedView';
            if (routeName === 'CitySelectorView') {
              return <CitySelectorViewHeader />;
            } else if (routeName !== 'FeedView') {
              return <BackHeader />;
            }
          },
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={require('assets/icons/WeekIcon.png')}
              style={[
                {
                  width: size,
                  height: size,
                  tintColor: color,
                },
                focused ? selectedTab : unselectedTab,
              ]}
            />
          ),
        })}
      />
      <Tab.Screen
        name={'Create'}
        component={ChatScreen}
        options={({ route }) => ({
          animationEnabled: true,
          lazy: false,
          tabBarShowLabel: false,

          header: () => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? 'FeedView';
            if (routeName === 'CitySelectorView') {
              return <CitySelectorViewHeader />;
            } else if (routeName !== 'FeedView') {
              return <BackHeader />;
            }
          },
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={require('assets/icons/WeekIcon.png')}
              style={[
                {
                  width: size,
                  height: size,
                  tintColor: color,
                },
                focused ? selectedTab : unselectedTab,
              ]}
            />
          ),
        })}
      />
      <Tab.Screen
        name={'Build'}
        component={WeekStack}
        options={({ route }) => ({
          animationEnabled: true,
          lazy: false,
          tabBarShowLabel: false,
          header: () => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? 'FeedView';
            if (routeName === 'CitySelectorView') {
              return <CitySelectorViewHeader />;
            } else if (routeName !== 'FeedView') {
              return <BackHeader />;
            }
          },
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={require('assets/icons/WeekIcon.png')}
              style={[
                {
                  width: size,
                  height: size,
                  tintColor: color,
                },
                focused ? selectedTab : unselectedTab,
              ]}
            />
          ),
        })}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  selectedTab: {
    tintColor: 'white',
  },
  unselectedTab: {
    tintColor: 'grey',
  },
  tabIcon: {
    width: 24,
    height: 24,
  },
});

export default Tabs;
