import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

function BackHeader() {
  const { backButton, backText, backButtonIcon } = styles;
  const navigation = useNavigation();

  return (
    <SafeAreaView edges={["right", "top", "left"]} style={backButton}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={backText}>
        <Icon name="chevron-back" style={backButtonIcon} />
        <Text style={styles.text}>Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backButtonIcon: {
    color: "#fff",
    fontSize: 20,
    paddingRight: 5,
  },
  backButton: {
    padding: 10,
    backgroundColor: "black",
    display: "flex",
    justifyContent: "flex-start",
    paddingBottom: 12.5,
    paddingTop: 12.5,
  },
  backText: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BackHeader;
