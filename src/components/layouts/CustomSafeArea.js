import React from 'react';
import { useUserContext } from 'src/hooks/useUserContext';

const CustomSafeArea = ({
  component,
  colorKey = "main"
}) => {
  const { user, setUser, theme } = useUserContext();
  const styles = createStyles(theme);

  const customStyles = StyleSheet.create({
    container: {
      padding: styles.spacing.small,
      backgroundColor: styles.color[colorKey],
    },
  });


  return (
    <SafeAreaView
      edges={['right', 'top', 'left']}
      style={[customStyles.container]}
    >
      {component}
    </SafeAreaView>
  );
};

export default CustomWideButton;
