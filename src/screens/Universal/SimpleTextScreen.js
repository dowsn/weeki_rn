import React from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import TextLink from 'src/components/buttons/TextLink';
import { useUserContext } from 'src/hooks/useUserContext';

const SimpleTextScreen = ({ route }) => {
  const { title, text, navigation } = route.params;
  const { theme } = useUserContext();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.violet_darkest,
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    scrollView: {
      flex: 1,
      flexGrow: 1,
      paddingHorizontal: theme.spacing.small,
      paddingBottom: theme.spacing.small,
    },
    title: {
      paddingTop: theme.spacing.large,
      fontSize: theme.fontSizes.medium,
      color: theme.colors.yellow_light,
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: 24,
      marginBottom: 16,
    },
    text: {
      paddingTop: theme.spacing.large,
      color: theme.colors.yellow_light,
      fontSize: theme.fontSizes.small,
      lineHeight: 24,
      marginBottom: 32,
    },
    button: {
      paddingVertical: 16,
      marginHorizontal: 16,
      marginBottom: 24,
      borderRadius: 8,
    },
    buttonText: {
      color: '#fff',
      textAlign: 'center',
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {title && <Text style={styles.title}>{title}</Text>}
        {text && <Text style={styles.text}>{text}</Text>}
      </ScrollView>

      <TextLink
        text="Back"
        style={styles.button}
        onPress={() => navigation.goBack()}
      ></TextLink>
    </View>
  );
};



export default SimpleTextScreen;
