import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ArrowNavigation = ({ previous, next, title }) => {
  const { theme } = useUserContext();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 10,
    },
    button: {
      padding: 10,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.yellow_light,
    },
  });

  return (
    <View style={styles.container}>
      {previous && (
        <TouchableOpacity onPress={previous} style={styles.button}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
      {next && (
        <TouchableOpacity onPress={next} style={styles.button}>
          <Ionicons name="arrow-forward" size={24} color="black" />
        </TouchableOpacity>
      )}
    </View>
  );
};



export default ArrowNavigation;