import React, { useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useUserContext } from '../../../hooks/useUserContext';
import { createStyles } from '../../../styles';
import createScreenStyles from './WeekScreen.styles';

const WeekScreen = (
  weekId
) => {
  const { user, setUser, theme } = useUserContext();
  const { week, setWeek } = useState(""); // week info
  // topics
  // topics with notes type
  // weeks for that year


  const styles = createStyles(theme);
  const screenStyles = createScreenStyles(theme);

  useEffect(() => {
    async function useWeek(weekId)
  }, []);


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

export default WeekScreen;
