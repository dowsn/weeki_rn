import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";

function BackHeader() {
  const { header, backText, backButtonIcon, applyText } = styles;
  const navigation = useNavigation();

  return (
    <SafeAreaView edges={["right", "top", "left"]} style={header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={backText}>
        <Icon name="chevron-back" style={backButtonIcon} />
        <Text style={styles.text}>Back</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()} style={applyText}>
        <Text style={styles.text}>Apply</Text>
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
  header: {
    padding: 10,
    backgroundColor: "black",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12.5,
    paddingTop: 12.5,
  },
  backText: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  applyText: {
    width: "50%",
    flexDirection: "row",
    justifyContent: "flex-end"
  },
});

export default BackHeader;
