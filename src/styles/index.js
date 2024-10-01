import buttons from './buttons';
import chat from './chat';
import forms from './forms';
import layouts from './layouts';
import typography from './typography';

export const createStyles = (theme) => ({
  buttons: buttons(theme),
  forms: forms(theme),
  layouts: layouts(theme),
  typography: typography(theme),
  chat: chat(theme),
});
