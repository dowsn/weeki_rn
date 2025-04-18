import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useUserContext } from 'src/hooks/useUserContext';
import NormalButton from '../buttons/NormalButton';

const CharacterHeader = ({ navigation, title, text }) => {

  const backText = title
  const { user, theme } = useUserContext();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.dark,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.small, // Add gap between buttons
      padding: theme.spacing.small,
    },
    buttonWrapper: {
      flex: 1, // This makes each button wrapper take equal space
    },
    profileButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.small,
    },
    username: {
      color: theme.colors.light,
      fontSize: theme.fontSizes.middle,

      marginRight: theme.spacing.small,
    },
    icon: {
      color: theme.colors.light,
    },
    image: {
      width: 36,
      height: 36,
      borderRadius: 18,
    },
    imageIcon: {
      width: 46,
      height: 46,
    },
  });

  return (
    <SafeAreaView edges={['right', 'top', 'left']} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.buttonWrapper}>
          <NormalButton
            text="You"
            onPress={() => navigation.navigate('Character', { title, text, navigation, backText })}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CharacterHeader;
