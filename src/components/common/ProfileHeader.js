import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useUserContext } from 'src/hooks/useUserContext';
import EditProfileView from 'src/screens/Reflect/EditProfileView';

const ProfileHeader = ({ navigation }) => {
  const { user, theme } = useUserContext();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.dark,
    },
    header: {
      // padding: theme.spacing.small,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
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
    }
  });

  return (
    <SafeAreaView edges={['right', 'top', 'left']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('EditProfileView')}
          style={styles.profileButton}
        >
          <Image source={{ uri: user.profileImage }} style={styles.image} />
          {/* <Text style={styles.username}>{user.username}</Text> */}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('EditProfileView')}
          style={styles.profileButton}
        >
          <Image
            source={require('assets/icons/Review.png')}
            style={styles.imageIcon}
          />
          {/* <Text style={styles.username}>{user.username}</Text> */}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfileHeader;
