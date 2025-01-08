import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useUserContext } from 'src/hooks/useUserContext';

const WeekiLoading = () => {
  const { theme } = useUserContext();

  console.log('WeekiLoading rendered with theme:', theme);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme?.colors?.violet_darkest || '#000000',
    },
    logo: {
      width: 100,
      height: 100,
      marginBottom: 20,
    },
  });

  if (!theme) {
    console.log('Theme is undefined!');
    return (
      <View style={[styles.container, { backgroundColor: '#000000' }]}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
         source={require('../../../assets/icons/Logo_Violet.png')}
         style={styles.logo}
       />
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
