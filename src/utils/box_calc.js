import { Dimensions, Platform, StatusBar } from 'react-native';

const calculateFittingElements = (elementHeight, spacing, decrementHeight) => {
  // Get the screen height
  const screenHeight = Dimensions.get('window').height;

  // Calculate the height of the status bar
  const statusBarHeight =
    Platform.OS === 'android' ? StatusBar.currentHeight : 0;

  // Calculate the available height in CustomSafeArea
  // We're subtracting the status bar height and any additional decrement
  const availableHeight = screenHeight - statusBarHeight - decrementHeight;

  // Calculate how many elements fit
  // We add spacing to elementHeight because each element needs a space after it
  // except the last one, which is why we subtract one spacing at the end
  const fittingElements = Math.floor(
    (availableHeight + spacing) / (elementHeight + spacing),
  );

  return fittingElements;
};

export default calculateFittingElements;
