import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useUserContext } from '../../hooks/useUserContext';

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
}) => {
  const { theme } = useUserContext();
  const [showDatePicker, setShowDatePicker] = React.useState(false);

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalView: {
      width: '80%',
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 20,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
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
    datePickerContainer: {
      width: '100%',
      marginBottom: 15,
    },
  });

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      onDateChange(selectedDate);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.modalView}>
            {!showDatePicker ? (
              <>
                {chatSession && Object.keys(chatSession).length > 0 ? (
                  <>
                    {isToday && (
                      <TouchableOpacity
                        style={styles.button}
                        onPress={onOpenSession}
                      >
                        <Text style={styles.buttonText}>Open Session</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => setShowDatePicker(true)}
                    >
                      <Text style={styles.buttonText}>Reschedule</Text>
                    </TouchableOpacity>
                    {chatSession.time_left === 60 && (
                      <TouchableOpacity
                        style={[styles.button, styles.cancelButton]}
                        onPress={onCancel}
                      >
                        <Text style={styles.buttonText}>Cancel</Text>
                      </TouchableOpacity>
                    )}
                  </>
                ) : (
                  <>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => setShowDatePicker(true)}
                    >
                      <Text style={styles.buttonText}>Select Date</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={onSave}>
                      <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                  </>
                )}
              </>
            ) : (
              <View style={styles.datePickerContainer}>
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'inline' : 'default'}
                  onChange={handleDateChange}
                  style={
                    Platform.OS === 'ios'
                      ? { height: 340, width: 300 }
                      : undefined
                  }
                />
                {chatSession && Object.keys(chatSession).length > 0 ? (
                  <TouchableOpacity
                    style={styles.button}
                    onPress={onReschedule}
                  >
                    <Text style={styles.buttonText}>Save New Date</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.button} onPress={onSave}>
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default CustomDatePickerModal;
