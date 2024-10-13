import { useNavigation } from '@react-navigation/native';
import { useUserContext } from 'src/hooks/useUserContext';

const Note = ({ id, topicColor, date_created, text }) => {
    const navigation = useNavigation()

  const { theme } = useUserContext()

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
        textAlign: 'left'
        // maybe different
      },

      noteHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.small,
      },

      dateText: {
        fontSize: theme.fontSizes.small,
        color: theme.colors.onSurface,
        textAlign: 'right'
      }
    });

  // make editable
  // add scroll down on big

  return (
    <TouchableOpacity activeOpacity={0.5} onPress={handleExpand}>
      <View style={[customStyles.note]}>
        <View style={[customStyles.noteHeader]}>
          <Text style={[customStyles.dateText]}>{date_created}</Text>
          <EditButton
            onPress={() =>
              navigation.navigate('NoteDetail', { item: item })
            }
          />
        </View>
        <Text style={[customStyles.noteText]}>{text}</Text>
      </View>
    </TouchableOpacity>
  );

}

export default Note