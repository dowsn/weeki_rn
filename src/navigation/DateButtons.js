import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import NormalButton from 'src/components/buttons/NormalButton';
import { Text } from 'src/components/common/Text';
import { fontSizes } from 'src/constants/theme';
import { useUserContext } from 'src/hooks/useUserContext';

const DateButtons = ({ navigation, selectedId, onSelect }) => {
  const { theme } = useUserContext();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.violet_darkest,
      padding: 10,
      gap: 10, // Add space between buttons
    },
    buttonContainer: {
      flex: 1, // Make buttons take equal space
    },
    text: {
      color: theme.colors.yellow_light,
      fontSize: fontSizes.medium,
    },
    greenText: {
      color: theme.colors.green,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <NormalButton
          text="Move"
          onPress={() =>
            navigation.navigate('Select', {
              selectedId,
              onSelect: (newSessionId) => {
                navigation.goBack();
                onSelect(newSessionId);
              },
            })
          }
        />
      </View>
      <View style={styles.buttonContainer}>
        <NormalButton
          text="Forward"
          onPress={() => onSelect(null)}
          colorType="green"
        />
      </View>
    </View>
  );
};


export default DateButtons;
