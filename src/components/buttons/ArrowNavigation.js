import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'src/components/common/Text';
import { useUserContext } from 'src/hooks/useUserContext';

const ArrowNavigation = ({ previous, next, date, onNavigate }) => {
  const { theme } = useUserContext();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 10,
    },
    navigationSection: {
      flex: 1,
      alignItems: 'flex-start',
    },
    titleSection: {
      flex: 2,
      alignItems: 'center',
    },
    rightSection: {
      flex: 1,
      alignItems: 'flex-end',
    },
    button: {
      padding: 10,
    },
    title: {
      fontSize: 18,
      color: theme.colors.yellow_light,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.navigationSection}>
        {previous && (
          <TouchableOpacity
            onPress={() => onNavigate(previous)}
            style={styles.button}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={theme.colors.yellow_light}
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.titleSection}>
        <Text style={styles.title}>{date}</Text>
      </View>
      <View style={styles.rightSection}>
        {next && (
          <TouchableOpacity
            onPress={() => onNavigate(next)}
            style={styles.button}
          >
            <Ionicons
              name="chevron-forward"
              size={24}
              color={theme.colors.yellow_light}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default ArrowNavigation;
