import { Asset } from 'expo-asset';
import React from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import { useUserContext } from 'src/hooks/useUserContext';

const WeekiLoading = () => {
  const { theme } = useUserContext();
  const [imageError, setImageError] = React.useState(false);

  React.useEffect(() => {
    // Preload the image
    Asset.fromModule(require('../../../assets/icons/Logo_Violet.png'))
      .downloadAsync()
      .catch((error) => {
        console.error('Failed to preload image:', error);
        setImageError(true);
      });
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.violet_darkest,
    },
    logo: {
      width: 100,
      height: 100,
      marginBottom: 20,
    },
  });

  return (
    <View style={styles.container}>
      {!imageError && (
        <Image
          source={require('../../../assets/icons/Logo_Violet.png')}
          style={styles.logo}
          onError={(error) => {
            console.error('Image loading error:', error.nativeEvent.error);
            setImageError(true);
          }}
        />
      )}
      <ActivityIndicator size="large" color={theme.colors.violet_light} />
    </View>
  );
};

export default WeekiLoading;

// import React from 'react';
// import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
// import { useUserContext } from 'src/hooks/useUserContext';

// const WeekiLoading = () => {

//   const {theme} = useUserContext();

//   const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: theme.colors.violet_darkest,
//   },
//   logo: {
//     width: 100,
//     height: 100,
//     marginBottom: 20,
//   },
// });

//   return (
//     <View style={styles.container}>
//       {/* <Image
//         source={require('../../../assets/icons/Logo_Violet.png')}
//         style={styles.logo}
//       /> */}
//       <ActivityIndicator size="large" color={theme.colors.violet_light} />
//     </View>
//   );
// };

// export default WeekiLoading;
