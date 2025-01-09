const baseColors = {
  marineBlue: {
    main: '#0C0313',
    light: '#E6D6FF', // logo tez
    dark: '#9932CC', // konverzace ready
    // darkest: '#000A14',
  },
  moleskin: {
    main: '#FFFFDF',
    light: '#FFFFD6',
    dark: '#FFFFB7',
    // lightest: '#FAFAF5',
  },
  gray: {
    light: '#D0D0C8',
    dark: '#A0A096',
  },
  accent: {
    green: '#03C04A',
    red: '#F44336',
  },
  messages: {
    me: '#03C04A',
    mr_week: '#F44336',
  },
};

// Light mode colors
export const lightColors = {
  violet_darkest: baseColors.marineBlue.main,
  violet_light: baseColors.marineBlue.light,
  violet_darker: baseColors.marineBlue.dark,
  yellow_light: baseColors.moleskin.main,
  yellow_darker: baseColors.moleskin.light,
  yellow_darkest: baseColors.moleskin.dark,

  // me: baseColors.messages.me,
  // mr_week: baseColors.messages.mr_week,

  green: baseColors.accent.green,
  red: baseColors.accent.red,

  // background: baseColors.moleskin.main,


  // surface: baseColors.moleskin.light,
  // surfaceVariant: baseColors.moleskin.lighter,

  // onBackground: baseColors.marineBlue.main,

  // onSurface: baseColors.marineBlue.light,
  // onSurfaceVariant: baseColors.marineBlue.dark,

  // primary: baseColors.marineBlue.main,
  // secondary: baseColors.marineBlue.light,
  // tertiary: baseColors.marineBlue.dark,

  gray: baseColors.gray.dark,
  ...baseColors.accent,
};

// Dark mode colors
export const darkColors = {
  violet_darkest: baseColors.marineBlue.main,
  violet_light: baseColors.marineBlue.light,
  violet_dark: baseColors.marineBlue.dark,
  light: baseColors.moleskin.light,
  yellow_light: baseColors.moleskin.light,
  yellow_dark: baseColors.moleskin.dark,

  green: baseColors.accent.green,
  red: baseColors.accent.red,

  gray: baseColors.gray.dark,
  ...baseColors.accent,

  // background: baseColors.marineBlue.main,
  // surface: baseColors.marineBlue.light,

  // surfaceVariant: baseColors.marineBlue.dark,
  // onBackground: baseColors.moleskin.main,
  // onSurface: baseColors.moleskin.light,
  // onSurfaceVariant: baseColors.moleskin.lighter,
  // primary: baseColors.moleskin.main,
  // secondary: baseColors.moleskin.light,
  // tertiary: baseColors.moleskin.lighter,
};

export const spacing = {
  small: 8,
  medium: 16,
  large: 24,
};

export const fontSizes = {
  small: 14,
  medium: 16,
  large: 20,
};

export const borderRadii = {
  small: 4,
  medium: 8,
  large: 20,
};

export const line = {
  small: 1,
  medium: 2,
  large: 4,
};
