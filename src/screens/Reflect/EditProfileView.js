import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import NormalButton from 'src/components/buttons/NormalButton';
import { useUserContext } from 'src/hooks/useUserContext';

const EditProfileView = ({ navigation }) => {
  const { theme } = useUserContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const { user, setUser, logout } = useUserContext();

  const logoutHandler = async () => {
      await logout();
      // setUser({ userId: 0 });
    };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      // backgroundColor: theme.colors.dark,
      padding: theme.spacing.small,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.small,
    },
    backText: {
      color: theme.colors.onBackground,
      fontSize: theme.fontSizes.middle,
      marginLeft: theme.spacing.small,
    },
    form: {
      padding: theme.spacing.medium,
    },
    input: {
      backgroundColor: theme.colors.light,
      padding: theme.spacing.small,
      borderRadius: 8,
      marginBottom: theme.spacing.medium,
      fontSize: theme.fontSizes.middle,
    },
    saveButton: {
      backgroundColor: theme.colors.primary,
      padding: theme.spacing.small,
      borderRadius: 8,
      alignItems: 'center',
    },
    saveButtonText: {
      color: theme.colors.light,
      fontSize: theme.fontSizes.middle,
      fontWeight: 'bold',
    },
  });

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log('Name:', name);
    console.log('Email:', email);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={theme.colors.onBackground} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor={theme.colors.gray}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor={theme.colors.gray}
          keyboardType="email-address"
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>

        <NormalButton text="Logout" onPress={logoutHandler} />
      </View>
    </SafeAreaView>
  );
};

export default EditProfileView;