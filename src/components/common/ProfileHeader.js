import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useUserContext } from 'src/hooks/useUserContext';
import { showAlert } from 'src/utils/alert';
import NormalButton from '../buttons/NormalButton';

const ProfileHeader = ({ navigation, hasExpiredSession }) => {
  const { user, theme } = useUserContext();

  const handleMomentsPress = () => {
    if (!hasExpiredSession) {
      showAlert('Weeki', "Here you will be able to review our moments together. Click on me to schedule a first session.");
      return;
    }
          navigation.navigate('OldSessions', { selected_id: null })

  }



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
      fontWeight: 'bold',
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
            text="Present"
            onPress={() => navigation.navigate('You', { selected_id: null })}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <NormalButton
            text="Moments"
            onPress={handleMomentsPress}

          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileHeader;
