// import { format } from 'date-fns'; // For date formatting
// import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'; // For icons
import React, { useEffect, useRef, useState } from 'react';
import {
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { borderRadii, fontSizes } from 'src/constants/theme';
import { useUserContext } from 'src/hooks/useUserContext';

const TopicBox = ({ id, title, color, size, navigation }) => {

  const { theme } = useUserContext();
  const styles = StyleSheet.create({
    container: {
      width: size,
      height: size,
      borderWidth: theme.line.small,
      borderColor: color,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: theme.borderRadii.large,
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.small,
    },
    text: {
      color: theme.colors.onSurface,
      textAlign: 'center',
      fontSize: theme.fontSizes.medium,
    },
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate('TopicReflectionView', {
        topicId: id
      })}
    >
      <Text style={styles.text} numberOfLines={2}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};``

// const TopicBox = ({ id, title, color }) => {

//   const { theme } = useUserContext();

//   const openConversation = () => {
//     // Implement logic to open DetailMessage
//     console.log('Opening DetailMessage for id:', id);
//   };

//   const styles = StyleSheet.create({
//     container: {
//       borderColor: color,
//       borderWidth: 1,
//       borderRadius: theme.borderRadii.large,
//       backgroundColor: theme.colors.surface,
//       justifyContent: 'left',
//       paddingHorizontal: theme.spacing.small,
//       paddingVertical: theme.spacing.small
//     },

//     topicText: {
//       color: color
//     }
//   });

//   return (
//     <TouchableOpacity style={styles.container}>
//       <Text style={styles.topicText}>{title}</Text>
//     </TouchableOpacity>
//   );
// };

export default TopicBox;
