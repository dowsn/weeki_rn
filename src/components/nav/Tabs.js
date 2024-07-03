import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useState } from "react";
import { Image, SafeAreaView, StyleSheet, View } from "react-native";
import ExhibitionDetail from "../details/ExhibitionDetail";
import BackHeader from "../header/BackHeader";
import FeedHeader from "../header/FeedHeader";
import CitySelectorViewHeader from "../header/CitySelectorViewHeader";
import CitySelectorView from "../main/CitySelectorView";
import FeedView from "../main/FeedView";
import MapView from "../main/MapView";

const Tab = createBottomTabNavigator();
const FeedStack = createStackNavigator();

const Tabs = ({ user }) => {
  const { selectedTab, unselectedTab, tabIcon } = styles;

  function FeedStackScreen() {
    return (
      <FeedStack.Navigator
        screenOptions={{
          headerShown: false,
          lazy: false
        }}
      >
        <FeedStack.Screen name="FeedView" component={FeedView} />
        <FeedStack.Screen
          name="ExhibitionDetail"
          component={ExhibitionDetail}
          options={{
            // header: () => <BackHeader />,
            headerShown: false,
            // headerTitle: "", // Hide the title
            animationEnabled: true,
            lazy: false
          }}
        />
        <FeedStack.Screen
          name="CitySelectorView"
          component={CitySelectorView}
          options={{
            // header: () => <BackHeader />,
            headerShown: false,
            // headerTitle: "", // Hide the title
            animationEnabled: true,
            lazy: false
          }}
        />
      </FeedStack.Navigator>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={{
        header: () => <FeedHeader />,
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "grey",
        tabBarStyle: {
          backgroundColor: "black",
        },
        animationEnabled: true,
      }}
    >
      <Tab.Screen
        name={"Exhibitionary"}
        component={FeedStackScreen}
        options={({ route }) => ({
          animationEnabled: true,
          lazy: false,
          header: () => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? "FeedView";
            if (routeName == "FeedView") {
              return <FeedHeader />;
            } else if (routeName == "CitySelectorView") {
              return <CitySelectorViewHeader />;
            } else {
              return <BackHeader />;
            }
          },
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../../assets/icons/ExhibitionsButton2525.png")}
              style={[tabIcon, focused ? selectedTab : unselectedTab]}
            />
          ),
        })}
      />
      <Tab.Screen
        name={"MapView"}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../../assets/icons/locate_48x48_Mini.png")}
              style={[tabIcon, focused ? selectedTab : unselectedTab]}
            />
          ),
        }}
      >
        {() => <MapView user={user} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightblue",
  },
  selectedTab: {
    tintColor: "white",
  },
  unselectedTab: {
    tintColor: "grey",
  },
  tabIcon: {
    width: 24,
    height: 24,
  },
});

export default Tabs;
