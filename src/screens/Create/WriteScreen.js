import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNote } from 'src/hooks/useNote';
import { useUserContext } from 'src/hooks/useUserContext';
import { showAlert } from 'src/utils/alert';

const WriteScreen = () => {
  const { theme, user } = useUserContext();
  const navigation = useNavigation();
  const [text, setText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const { saveNote, isLoading, error } = useNote();

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (event) => {
        setKeyboardHeight(event.endCoordinates.height);
      },
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      },
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);


  const tabIcons = {
    Done: require('assets/icons/Done.png'),
    Record: require('assets/icons/Record.png'),
  };

  const handleBackPress = () => {
    if (!text.trim()) {
      navigation.navigate('Reflect');
    } else {
      setShowModal(true);
    }
  };

  const handleNote = async() => {
       try {
         const response = await saveNote(user.userId, text);

         if (response.error) {
           showAlert('Login Error', response.message);
         } else {

          showAlert('Successfully saved');

          setText('');
         }



       } catch (error) {
         showAlert(
           'Saving Note Error',
           error.message || 'An unexpected error occurred',
         );


       }
  };

  const handleSave = () => {
    handleNote();
    setShowModal(false);
  };

  const handleDiscard = () => {
    setShowModal(false);
    navigation.navigate('Reflect');
    setText('');
  };

  const TabItem = ({ name, onPress, isLoading }) => (
    <Pressable style={styles.tabItem} onPress={onPress} disabled={isLoading}>
      <Image
        source={tabIcons[name]}
        style={{
          width: 24,
          height: 24,
          tintColor: '#FFFFFF',
        }}
      />
      <Text style={styles.tabText}>{name}</Text>
    </Pressable>
  );

  const styles = StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: 'black',
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    contentContainer: {
      flex: 1,
      width: '100%',
      marginBottom: 80, // Height of tab bar
    },
    input: {
      flex: 1,
      width: '100%',
      padding: theme.spacing.medium,
      borderWidth: 0,
      textAlignVertical: 'top',
      color: theme.colors.onSurface,
      fontSize: theme.fontSizes.medium,
      backgroundColor: theme.colors.background,
    },
    tabBar: {
      flexDirection: 'row',
      backgroundColor: '#0A2140',
      height: 80,
      borderTopWidth: 0,
      paddingBottom: Platform.OS === 'ios' ? theme.spacing.medium : 0,
      position: 'absolute',
      bottom: keyboardHeight, // Dynamic positioning based on keyboard height
      left: 0,
      right: 0,
      zIndex: 999,
    },
    tabItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      paddingTop: 8,
      paddingBottom: 4,
    },
    tabText: {
      fontSize: theme.fontSizes.middle,
      marginTop: theme.spacing.small,
      color: '#FFFFFF',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadii.large,
      padding: theme.spacing.large,
      width: '80%',
      maxWidth: 300,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 20,
      color: theme.colors.onSurface,
      marginBottom: 24,
      fontWeight: '600',
    },
    buttonContainer: {
      width: '100%',
      gap: 8,
    },
    button: {
      paddingVertical: theme.spacing.medium,
      borderRadius: theme.borderRadii.large,
      width: '100%',
      alignItems: 'center',
    },
    saveButton: {
      backgroundColor: theme.colors.green,
    },
    cancelButton: {
      backgroundColor: theme.colors.gray,
    },
    discardButton: {
      backgroundColor: theme.colors.red,
      marginTop: 8,
    },
    buttonText: {
      color: theme.colors.light,
      fontSize: theme.fontSizes.medium,
      fontWeight: '500',
    },
  });

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <TextInput
            style={styles.input}
            multiline
            placeholder="Start typing..."
            placeholderTextColor="#999"
            textAlignVertical="top"
            value={text}
            onChangeText={setText}
          />
        </View>

        <View style={[styles.tabBar]}>
          {user.isRecording && <TabItem name="Stop" />}
          <TabItem name="Done" onPress={handleBackPress} disabled={isLoading} />
        </View>
      </View>

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Save Note?</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.discardButton]}
                onPress={handleDiscard}
              >
                <Text style={styles.buttonText}>Discard</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default WriteScreen;
