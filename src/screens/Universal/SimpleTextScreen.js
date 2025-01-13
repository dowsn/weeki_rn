import React from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import TextLink from 'src/components/buttons/TextLink';
import CustomSafeView from 'src/components/layouts/CustomSafeArea';
import { useUserContext } from 'src/hooks/useUserContext';

const SimpleTextScreen = ({ route }) => {
  const { title, text, navigation, backText } = route.params;
  const { theme } = useUserContext();

  const styles = StyleSheet.create({

    scrollView: {
      flex: 1,
      flexGrow: 1,
      paddingHorizontal: theme.spacing.small,
      paddingBottom: theme.spacing.small,
    },
    title: {
      paddingTop: theme.spacing.large,
      fontSize: theme.fontSizes.medium,
      color: theme.colors.yellow_light,

      textAlign: 'center',
      marginTop: 24,
      marginBottom: 16,
    },
    text: {
      paddingTop: theme.spacing.large,
      color: theme.colors.yellow_light,
      fontSize: theme.fontSizes.small,
      lineHeight: 24,
      marginBottom: 32,
    },
    button: {
      flexDirection: 'flex-end',
      // paddingVertical: 16,
      // marginHorizontal: 16,
      // marginBottom: 24,
      // borderRadius: 8,
    },
    buttonText: {
      color: '#fff',
      textAlign: 'center',
      fontWeight: '600',
    },
  });

  return (
    <CustomSafeView>
      <ScrollView style={styles.scrollView}>
        {title && <Text style={styles.title}>{title}</Text>}
        {text && <Text style={styles.text}>{text}</Text>}
      </ScrollView>

      <TextLink
        text={backText || 'Back'}
        style={styles.button}
        onPress={() => navigation.goBack()}
      ></TextLink>
    </CustomSafeView>
  );
};



export default SimpleTextScreen;
