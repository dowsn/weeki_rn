import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TabScreen from 'src/components/layouts/TabScreen';
import { useUserContext } from 'src/hooks/useUserContext';
import BackHeader from '../components/common/BackHeader';
import ChatScreen from '../screens/Create/ChatScreen';
import SpeechScreen from '../screens/Create/SpeechScreen';
import DashboardScreen from '../screens/Dashboard/DashboardScreen/DashboardScreen';
import WeekStack from '../screens/Dashboard/WeekScreen/WeekScreen';

const Tab = createBottomTabNavigator();

const Tabs = () => {
  const { selectedTab, unselectedTab } = styles;
  const { user, setUser, theme } = useUserContext();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.light,
        tabBarInactiveTintColor: theme.colors.gray,
        tabBarStyle: {
          backgroundColor: theme.colors.dark,
          height: 60,
          borderTopWidth: 0,
        },
        animationEnabled: true,
      }}
    >
      {['Reflect', 'Record', 'Review'].map((tabName, index) => (
        <Tab.Screen
          key={tabName}
          name={tabName}
          component={
            tabName === 'Reflect'
              ? DashboardScreen
              : tabName === 'Record'
                ? SpeechScreen
                : TabScreen
          }
          options={({ route }) => ({
            animationEnabled: true,
            lazy: false,
            tabBarShowLabel: false,
            header: () => {
              const routeName =
                getFocusedRouteNameFromRoute(route) ?? 'FeedView';
              if (routeName === 'CitySelectorView') {
                return <CitySelectorViewHeader />;
              } else if (routeName !== 'FeedView') {
                return <BackHeader />;
              }
            },
            tabBarIcon: ({ focused, color, size }) => (
              <View
                style={[
                  styles.tabItem,
                  index === 1 && styles.middleTab,
                  focused && styles.focusedTab,
                ]}
              >
                <Image
                  source={require('assets/icons/Review.svg')}
                  style={[
                    {
                      width: size,
                      height: size,
                      tintColor: index === 1 ? theme.colors.dark : color,
                    },
                    focused ? selectedTab : unselectedTab,
                  ]}
                />
                <Text
                  style={[
                    styles.tabText,
                    { color: index === 1 ? theme.colors.dark : color },
                  ]}
                >
                  {tabName}
                </Text>
                {focused && <View style={styles.selectionIndicator} />}
              </View>
            ),
          })}
        />
      ))}
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
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    paddingTop: 8,
    paddingBottom: 4,
  },
  middleTab: {
    backgroundColor: '#03C04A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusedTab: {
    // Remove borderTopWidth and borderTopColor from here
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
  },
  selectionIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'white',
  },
});

export default Tabs;
