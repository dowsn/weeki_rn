import { useNavigation } from '@react-navigation/native';
import { ChevronDown, ChevronUp } from 'lucide-react'; // Make sure to import these icons
import React, { useEffect, useRef, useState } from 'react';
import {
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useUserContext } from 'src/hooks/useUserContext';
import EditButton from './EditButton'; // Assuming you have this component

const FIXED_HEIGHT = 100; // Adjust this value to set the desired fixed height

const Note = ({ id, topicColor, date_created, text }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);
  const navigation = useNavigation();
  const { theme } = useUserContext();
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      textRef.current.measure((x, y, width, height, pageX, pageY) => {
        setCanExpand(height > FIXED_HEIGHT);
      });
    }
  }, [text]);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  const customStyles = StyleSheet.create({
    note: {
      paddingVertical: theme.spacing.small,
      paddingHorizontal: theme.spacing.small,
      width: '100%',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadii.large,
      marginVertical: theme.spacing.small,
      borderWidth: 2,
      borderColor: topicColor,
    },
    noteText: {
      fontSize: theme.fontSizes.small,
      color: theme.colors.onSurface,
      textAlign: 'left',
    },
    noteHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.small,
    },
    dateText: {
      fontSize: theme.fontSizes.small,
      color: theme.colors.onSurface,
      textAlign: 'right',
    },
    textContainer: {
      maxHeight: isExpanded ? undefined : FIXED_HEIGHT,
      overflow: 'hidden',
    },
    expandButton: {
      alignSelf: 'center',
      marginTop: theme.spacing.small,
    },
  });

  return (
    <View style={customStyles.note}>
      <View style={customStyles.noteHeader}>
        <Text style={customStyles.dateText}>{date_created}</Text>
        <EditButton
          onPress={() =>
            navigation.navigate('NoteDetail', {
              item: { id, topicColor, date_created, text },
            })
          }
        />
      </View>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={canExpand ? toggleExpand : undefined}
      >
        <View style={customStyles.textContainer}>
          <Text ref={textRef} style={customStyles.noteText}>
            {text}
          </Text>
        </View>
      </TouchableOpacity>
      {canExpand && (
        <TouchableOpacity
          style={customStyles.expandButton}
          onPress={toggleExpand}
        >
          {isExpanded ? (
            <ChevronUp size={16} color={theme.colors.onSurface} />
          ) : (
            <ChevronDown size={16} color={theme.colors.onSurface} />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

// expandaple a fixed with
// button to edit
// date only but db full date
// limit number on screen

export default Note;
