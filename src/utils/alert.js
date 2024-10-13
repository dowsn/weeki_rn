import { Alert } from 'react-native';

export const showAlert = (title, message, options = null) => {
  Alert.alert(
          title,
          message,
          options
        );
}
