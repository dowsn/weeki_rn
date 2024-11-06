import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useUserContext } from 'src/hooks/useUserContext';

function ProfileHeader() {
  const { user } = useUserContext();

  const { theme } = useUserContext();
  const navigation = useNavigation();

  const styles = StyleSheet.create({
    backButton: {
      padding: theme.spacing.small,
      backgroundColor: theme.colors.dark,
      display: 'flex',
      justifyContent: 'flex-start',
      paddingBottom: theme.spacing.small,
      paddingTop: theme.spacing.small,
    },
    backText: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 20,
      paddingTop: theme.spacing.small,
    },
    text: {
      color: theme.colors.light,
      fontSize: theme.fontSizes.small,
      fontWeight: 'bold',
    },
  });

  return (
    <SafeAreaView edges={['right', 'top', 'left', ]} style={styles.backButton}>
      <TouchableOpacity
        onPress={() => console.log('he')}
        style={styles.backText}
      >
        <Text style={styles.text}>{user.username}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// improve the styles also in backbutton
const styles = StyleSheet.create({
  backButtonIcon: {
    color: '#fff',
    fontSize: 20,
    paddingRight: 5,
  },
  backButton: {
    padding: 10,
    backgroundColor: 'black',
    display: 'flex',
    justifyContent: 'flex-start',
    paddingBottom: 12.5,
    paddingTop: 12.5,
  },
  backText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileHeader;
