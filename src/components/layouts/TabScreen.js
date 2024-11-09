import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CustomSafeView from './CustomSafeArea';

const Tab = createMaterialTopTabNavigator();

const WComponent = () => {

  //  const { user, setUser, theme } = useUserContext();
  //  const [notes, setNotes] = useState([]);
  // const [page, setPage] = useState(1);
  // const [weekId, setWeekId] = useState(undefined);
  // const [pagination, setPagination] = useState(10);

  //  const styles = createStyles(theme);

  //  const { getWeek, isLoading, error } = useWeek();

  //  useEffect(() => {
  //    const fetchWeek = async () => {
  //      try {
  //        const response = await getWeek(user.userId, weekId, page, pagination);
  //        if (response.error) {
  //          showAlert('Error:', response.message);
  //        } else {
  //          setNotes(response.content);
  //        }
  //      } catch (error) {
  //        console.log(
  //          'Error fetching topics',
  //          error.message || 'An unexpected error occurred',
  //        );
  //      }
  //    };

  //    fetchWeek();
  //  }, [weekId]);

  return (
    <View >
      <Text>This is the W tab content</Text>
    </View>
  );
};

const YComponent = () => (
  <View style={styles.tabContent}>
    <Text>This is the Y tab content</Text>
  </View>
);

const TComponent = () => (
  <View style={styles.tabContent}>
    <Text>This is the T tab content</Text>
  </View>
);

const TabScreen = () => {
  return (
    <CustomSafeView noPadding={true}>
      <NavigationContainer independent={true}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            // Added route here
            tabBarIcon: (
              { focused }, // Removed unused color parameter
            ) => (
              <Text style={{ color: focused ? 'blue' : 'gray', fontSize: 16 }}>
                {route.name}
              </Text>
            ),
            tabBarActiveTintColor: 'blue',
            tabBarInactiveTintColor: 'gray',
            tabBarShowLabel: false,
            tabBarIndicatorStyle: { backgroundColor: 'blue' },
          })}
        >
          <Tab.Screen name="W" component={WComponent} />
          <Tab.Screen name="Y" component={YComponent} />
          <Tab.Screen name="T" component={TComponent} />
        </Tab.Navigator>
      </NavigationContainer>
    </CustomSafeView>
  );
};

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TabScreen;
