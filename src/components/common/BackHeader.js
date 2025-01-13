import { useNavigation } from '@react-navigation/native';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { Text } from 'src/components/common/Text';
import { useUserContext } from 'src/hooks/useUserContext';

function BackHeader({ text, onPress }) {
  const { theme } = useUserContext();
  const navigation = useNavigation();

  const styles = StyleSheet.create({
    backButtonIcon: {
      color: theme.colors.surface,
      fontSize: 16,
      paddingRight: 5,
    },
    backButton: {
      padding: theme.spacing.small,
      backgroundColor: theme.colors.background,
      display: 'flex',
      justifyContent: 'flex-start',
      paddingBottom: theme.spacing.small,
      paddingTop: theme.spacing.small,
    },
    backText: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    text: {
      color: theme.colors.surface,
      fontSize: 27,
    },
  });

  return (
    <TouchableOpacity onPress={onPress} style={styles.backButton}>
      <Icon name="chevron-back" style={styles.backButtonIcon} />
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
}



export default BackHeader;
