import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import UseEffect from 'react';
import { Dimensions, Modal, Platform, StyleSheet, View } from 'react-native';
import Text from 'src/components/common/Text'; // Import your custom Text component
import { useUserContext } from '../../hooks/useUserContext';
import NormalButton from '../buttons/NormalButton';
import TextLink from '../buttons/TextLink';
import CustomSafeView from '../layouts/CustomSafeArea';
import SpacingView from '../layouts/SpacingView';

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
  text = "",

  onCloseSignal = () => {
    console.log('onCloseSignal');
  },
  onEndSignal = () => {
    console.log('onEndSignal');
  }
}) => {
  const { theme } = useUserContext();
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const screenWidth = Dimensions.get('window').width;
  const [isProcessing, setIsProcessing] = React.useState(false);

  const noTopics = text === 'No current topics' || text === '' || text === 'None';



  React.useEffect(() => {
    if (!visible) {
      setShowDatePicker(false);
    }
  }, [visible]);





  const handleAndroidDateConfirm = async (event, selectedDate) => {
    if (isProcessing) return;

    if (event.type === 'set' && selectedDate) {
      setIsProcessing(true);

      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      const selectedWithoutTime = new Date(selectedDate);
      selectedWithoutTime.setHours(0, 0, 0, 0);

      if (selectedWithoutTime >= currentDate) {
        try {
          onDateChange(selectedDate);

          if (chatSession && Object.keys(chatSession).length > 0) {
            await onReschedule(selectedDate);
          } else {
            await onSave(selectedDate);
          }
        } catch (error) {
          console.error('Date selection error:', error);
          setIsProcessing(false);
          return;
        }
      } else {
        onDateChange(currentDate);
      }
      setIsProcessing(false);
    }

    setShowDatePicker(false);

    if (event.type === 'dismissed') {
      onClose();
    }
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
     onEndSignal();
    //  onClose();
  };

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: theme.colors.violet_darkest,
    },
    modalView: {
      flex: 1,
      width: screenWidth,
      backgroundColor: theme.colors.violet_darkest,
    },
    contentContainer: {
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    topicContainer: {
      width: '100%',
      marginTop: 20,
      marginBottom: 10,
      padding: 15,
      borderRadius: 10,
      backgroundColor: theme.colors.violet_dark,
      alignItems: 'center',
    },
    topicText: {
      color: theme.colors.violet_light,
      fontSize: theme.fontSizes.medium,
      textAlign: 'center',
      marginBottom: 4,
      width: '100%',
    },
    topicTitle: {
      color: theme.colors.violet_light,
      fontSize: theme.fontSizes.large,
      textAlign: 'center',
      marginBottom: 8,
      width: '100%',
    },
    buttonContainer: {
      width: '100%',
      flex: 1,
      justifyContent: 'center',
    },
    footerPart: {
      width: '100%',
      justifyContent: 'flex-end',
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

  const renderFooterLinks = () => (
    <SpacingView spacing="large" style={styles.footerPart}>
      {!showDatePicker && (
        <>
          {chatSession && Object.keys(chatSession).length > 0 ? (
            <>
              {Object.keys(chatSession).length === 1 && (
                <TextLink
                  text="Focusboard"
                  onPress={() => {
                    onSave();
                    onCloseSignal();
                  }}
                  color={theme.colors.violet_light}
                />
              )}
              {Object.keys(chatSession).length > 1 && (
                <TextLink
                  text="Focusboard"
                  onPress={onClose}
                  color={theme.colors.violet_light}
                />
              )}
            </>
          ) : (
            <TextLink
              text="Focusboard"
              onPress={onClose}
              color={theme.colors.violet_light}
            />
          )}
        </>
      )}
    </SpacingView>
  );

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <CustomSafeView>
        <View style={styles.contentContainer}>
          {text !== '' && (
            <View style={styles.topicContainer}>
              {noTopics ? (
                <Text style={styles.topicText}>{text}</Text>
              ) : (
                <>
                  <Text style={styles.topicTitle}>Current topics</Text>
                  {text
                    .split(', ')
                    .slice(0, 3)
                    .map((topic, index) => (
                      <Text key={index} style={styles.topicText}>
                        • {topic}
                      </Text>
                    ))}
                </>
              )}
            </View>
          )}
          <View style={styles.buttonContainer}>
            {!showDatePicker ? (
              <>
                {chatSession && Object.keys(chatSession).length > 0 ? (
                  <>
                    {isToday && (
                      <NormalButton
                        text={
                          chatSession.time_left === 60 ? 'Start' : 'Continue'
                        }
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
                        text="End This Moment"
                        onPress={onEndSession}
                        colorType="red"
                      />
                    )}
                    {chatSession.time_left === 60 && (
                      <NormalButton
                        text="Cancel"
                        onPress={onCancel}
                        colorType="red"
                      />
                    )}
                  </>
                ) : (
                  <NormalButton
                    text="Schedule"
                    onPress={() => setShowDatePicker(true)}
                    colorType="violet"
                  />
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
                    onChange={
                      Platform.OS === 'ios'
                        ? handleIOSDateChange
                        : handleAndroidDateConfirm
                    }
                    style={
                      Platform.OS === 'ios'
                        ? { height: 340, width: 300 }
                        : undefined
                    }
                    textColor={
                      Platform.OS === 'ios'
                        ? 'black'
                        : theme.colors.violet_light
                    }
                    accentColor={theme.colors.yellow}
                    themeVariant="light"
                  />
                </View>
                {Platform.OS === 'ios' && (
                  <>
                    {chatSession && Object.keys(chatSession).length > 0 ? (
                      <NormalButton
                        text="Save"
                        onPress={onReschedule}
                        colorType="yellow"
                      />
                    ) : (
                      <NormalButton
                        text="Save"
                        onPress={onSave}
                        colorType="yellow"
                      />
                    )}
                    {/* Add the Close button here */}
                    <NormalButton
                      text="Close"
                      onPress={() => setShowDatePicker(false)}
                      colorType="violet"
                    />
                  </>
                )}
              </View>
            )}
          </View>
          {renderFooterLinks()}
        </View>
      </CustomSafeView>
    </Modal>
  );
};

export default CustomDatePickerModal;
