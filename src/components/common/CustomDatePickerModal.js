import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import UseEffect from 'react';
import { Dimensions, Modal, Platform, StyleSheet, View } from 'react-native';
import { useUserContext } from '../../hooks/useUserContext';
import NormalButton from '../buttons/NormalButton';
import TextLink from '../buttons/TextLink';

const CustomDatePickerModal = ({
  visible,
  onClose,
  date,
  onDateChange,
  onSave,
  chatSession,
  onCancel,
  onReschedule,
  onOpenSession,
  isToday,
  isAlreadySession = false,
  onCloseSignal = () => {console.log('onCloseSignal')},
}) => {
  const { theme } = useUserContext();
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const screenWidth = Dimensions.get('window').width;

  React.useEffect(() => {
    if (!visible) {
      setShowDatePicker(false);
    }
  }, [visible]);

  const handleClose = () => {
    setShowDatePicker(false);
    onClose();
  };

  const handleAndroidDateConfirm = (event, selectedDate) => {
    if (event.type === 'set') {
      if (selectedDate) {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        const selectedWithoutTime = new Date(selectedDate);
        selectedWithoutTime.setHours(0, 0, 0, 0);

        if (selectedWithoutTime >= currentDate) {
          onDateChange(selectedDate);
          if (chatSession && Object.keys(chatSession).length > 0) {
            onReschedule();
          } else {
            onSave();
          }
        } else {
          onDateChange(currentDate);
        }
      }
    } else if (event.type === 'dismissed') {
      onClose();
    }
    setShowDatePicker(false);
  };

  const handleIOSDateChange = (event, selectedDate) => {
    if (selectedDate) {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      const selectedWithoutTime = new Date(selectedDate);
      selectedWithoutTime.setHours(0, 0, 0, 0);

      if (selectedWithoutTime >= currentDate) {
        onDateChange(selectedDate);
      } else {
        onDateChange(currentDate);
      }
    }
  };

  const onEndSession = () => {
    onCloseSignal();
    onClose();
  };

  // Styles remain unchanged
  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: theme.colors.violet_darkest,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalView: {
      width: screenWidth,
      backgroundColor: theme.colors.violet_darkest,
      borderRadius: 20,
      padding: 20,
      alignItems: 'center',
    },
    contentContainer: {
      width: '100%',
      alignItems: 'center',
    },
    button: {
      width: '100%',
      borderRadius: 12,
      padding: 15,
      marginVertical: 8,
      elevation: 2,
      backgroundColor: theme.colors.violet_light,
    },
    buttonText: {
      color: theme.colors.violet_darkest,
      fontSize: theme.fontSizes.medium,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    cancelButton: {
      backgroundColor: theme.colors.red,
    },
    closeButton: {
      backgroundColor: theme.colors.gray_light,
    },
    datePickerContainer: {
      width: '100%',
      marginBottom: 15,
      backgroundColor: theme.colors.yellow_light,
      borderRadius: Platform.OS === 'ios' ? 10 : 0,
      padding: Platform.OS === 'ios' ? 10 : 0,
    },
    datePickerWrapper: {
      alignItems: 'center',
      width: '100%',
    },
  });

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalView}>
          <View style={styles.contentContainer}>
            {!showDatePicker ? (
              <>
                {chatSession && Object.keys(chatSession).length > 0 ? (
                  <>
                    {isToday && (
                      <NormalButton
                        text={chatSession.time_left === 60 ? 'Start' : 'Continue'}
                        onPress={onOpenSession}
                        colorType="green"
                      />
                    )}
                    <NormalButton
                      text="Reschedule"
                      onPress={() => setShowDatePicker(true)}
                      colorType="violet"
                    />
                    {Object.keys(chatSession).length === 1 && (
                      <NormalButton
                        text="End Session"
                        onPress={onEndSession}
                        colorType="red"
                      />
                    )}
                    {Object.keys(chatSession).length === 1 && (
                      <TextLink
                        text="Dashboard"
                        onPress={onSave}
                        color={showDatePicker ? theme.colors.violet_darkest : theme.colors.yellow_light}
                      />
                    )}
                    {chatSession.time_left === 60 && (
                      <NormalButton
                        text="Cancel"
                        onPress={onCancel}
                        colorType="red"
                      />
                    )}
                    {Object.keys(chatSession).length === 1 && (
                      <TextLink
                        text="Continue"
                        onPress={onClose}
                        color={theme.colors.green}
                      />
                    )}
                    {Object.keys(chatSession).length > 1 && (
                      <TextLink
                        text="Dashboard"
                        onPress={onClose}
                        color={showDatePicker ? theme.colors.violet_darkest : theme.colors.yellow_light}
                      />
                    )}
                  </>
                ) : (
                  <>
                    <NormalButton
                      text="Schedule"
                      onPress={() => setShowDatePicker(true)}
                      colorType="violet"
                    />
                    <TextLink
                      text="Dashboard"
                      onPress={onClose}
                      color={showDatePicker ? theme.colors.violet_darkest : theme.colors.yellow_light}
                    />
                  </>
                )}
              </>
            ) : (
              <View style={styles.datePickerContainer}>
                <View style={styles.datePickerWrapper}>
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode="date"
                    minimumDate={
                      isAlreadySession
                        ? new Date(new Date().setDate(new Date().getDate() + 1))
                        : new Date()
                    }
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={Platform.OS === 'ios' ? handleIOSDateChange : handleAndroidDateConfirm}
                    style={Platform.OS === 'ios' ? { height: 340, width: 300 } : undefined}
                    textColor={Platform.OS === 'ios' ? 'black' : theme.colors.violet_light}
                    accentColor={theme.colors.yellow}
                    themeVariant="light"
                  />
                </View>
                {Platform.OS === 'ios' && (
                  <>
                    {chatSession && Object.keys(chatSession).length > 0 ? (
                      <>
                        <NormalButton
                          text="Save"
                          onPress={onReschedule}
                          colorType="yellow"
                        />
                        {Object.keys(chatSession).length === 1 && (
                          <NormalButton
                            text="Continue"
                            onPress={onClose}
                            colorType="green"
                          />
                        )}
                        {Object.keys(chatSession).length > 1 && (
                          <TextLink
                            text="Dashboard"
                            onPress={onClose}
                            color={showDatePicker ? theme.colors.violet_darkest : theme.colors.yellow_light}
                          />
                        )}
                      </>
                    ) : (
                      <>
                        <NormalButton
                          text="Save"
                          onPress={onSave}
                          colorType="yellow"
                        />
                        <TextLink
                          text="Dashboard"
                          onPress={handleClose}
                          color={showDatePicker ? theme.colors.violet_darkest : theme.colors.yellow_light}
                        />
                      </>
                    )}
                  </>
                )}
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomDatePickerModal;
