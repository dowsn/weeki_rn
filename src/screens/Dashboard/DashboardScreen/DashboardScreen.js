import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../../constants/theme';
import { useUserContext } from '../../../hooks/useUserContext';
import { createStyles } from '../../../styles';
import createScreenStyles from './DashboardScreen.styles';

const DashboardScreen = () => {
  const { user, setUser, theme } = useUserContext();
  const styles = createStyles(theme);
  const screenStyles = createScreenStyles(theme);

  return (
    <View style={screenStyles.container}>
      <Text style={screenStyles.title}>Welcome to My App</Text>

      <View style={screenStyles.formContainer}>
        <Text style={styles.forms.label}>Enter your name:</Text>
        <TextInput style={styles.forms.input} placeholder="John Doe" />

        <Text style={styles.forms.label}>Enter your email:</Text>
        <TextInput
          style={styles.forms.input}
          placeholder="johndoe@example.com"
          keyboardType="email-address"
        />
      </View>

      <TouchableOpacity
        style={[
          styles.buttons.base,
          styles.buttons.primary,
          screenStyles.submitButton,
        ]}
      >
        <Text style={styles.buttons.text}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DashboardScreen;

// export default function Component() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.username}>@johndoe</Text>
//       <Image
//         source={{ uri: 'https://github.com/shadcn.png' }}
//         style={styles.profileImage}
//       />
//       <View style={styles.buttonContainer}>
//         <TouchableOpacity style={styles.button}>
//           <Text style={styles.buttonText}>Week</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.button}>
//           <Text style={styles.buttonText}>Year</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.button}>
//           <Text style={styles.buttonText}>Life</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'flex-start',
//     paddingTop: 50,
//     backgroundColor: '#f0f0f0',
//   },
//   username: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   profileImage: {
//     width: 150,
//     height: 150,
//     borderRadius: 75,
//     marginBottom: 30,
//   },
//   buttonContainer: {
//     width: '100%',
//     paddingHorizontal: 20,
//   },
//   button: {
//     backgroundColor: '#007AFF',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// })