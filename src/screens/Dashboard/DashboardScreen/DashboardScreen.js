import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NormalButton from 'src/components/buttons/NormalButton';
import FlexSpacer from 'src/components/common/FlexSpacer';
import MainTitle from 'src/components/common/MainTitle';
import CustomSafeView from 'src/components/layouts/CustomSafeArea';
import TopicGrid from 'src/components/layouts/TopicGrid';
import { useLogin } from 'src/hooks/useLogin';
import { useUserContext } from '../../../hooks/useUserContext';
import { createStyles } from '../../../styles';
import createScreenStyles from './DashboardScreen.styles';

const DashboardScreen = () => {
  const { user, setUser, theme } = useUserContext();
  const [topics, setTopics] = useState([])
  const styles = createStyles(theme);
  const screenStyles = createScreenStyles(theme);

  const logoutHandler = async () => {
    setUser({ userId: 0 });
  }

  return (
    <CustomSafeView>
      <MainTitle title={`Welcome ${user.username}`} />
      <FlexSpacer />
      <TopicGrid data={topics} />
      <View style={screenStyles.formContainer}>
        <Text style={styles.forms.label}>Enter your name: {user.userId}</Text>
        <TextInput style={styles.forms.input} placeholder="John Doe" />

        <Text style={styles.forms.label}>Enter your email:</Text>
        <TextInput
          style={styles.forms.input}
          placeholder="johndoe@example.com"
          keyboardType="email-address"
        />
      </View>

      <NormalButton
        text="Submit"
        onPress={() => console.log('Submit button pressed')}
      />
      <NormalButton text="Logout" onPress={logoutHandler} />
    </CustomSafeView>
  );
};

export default DashboardScreen;
