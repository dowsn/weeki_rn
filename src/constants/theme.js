const baseColors = {
  marineBlue: {
    main: '#001F3F',
    light: '#00172D',
    dark: '#000F1F',
    darkest: '#000A14',
  },
  moleskin: {
    main: '#F5F5F0',
    light: '#E8E8E0',
    lighter: '#F0F0E8',
    lightest: '#FAFAF5',
  },
  gray: {
    light: '#D0D0C8',
    dark: '#A0A096',
  },
  accent: {
    green: '#03C04A',
    red: '#F44336',
  },
};

// Light mode colors
export const lightColors = {
  dark: baseColors.marineBlue.main,
  light: baseColors.moleskin.light,

  green: baseColors.accent.green,

  background: baseColors.moleskin.main,

  surface: baseColors.moleskin.light,
  surfaceVariant: baseColors.moleskin.lighter,

  onBackground: baseColors.marineBlue.main,

  onSurface: baseColors.marineBlue.light,
  onSurfaceVariant: baseColors.marineBlue.dark,

  primary: baseColors.marineBlue.main,
  secondary: baseColors.marineBlue.light,
  tertiary: baseColors.marineBlue.dark,

  gray: baseColors.gray.light,
  ...baseColors.accent,
};

// Dark mode colors
export const darkColors = {
  dark: baseColors.marineBlue.main,
  light: baseColors.moleskin.light,

  background: baseColors.marineBlue.main,
  surface: baseColors.marineBlue.light,

  surfaceVariant: baseColors.marineBlue.dark,
  onBackground: baseColors.moleskin.main,
  onSurface: baseColors.moleskin.light,
  onSurfaceVariant: baseColors.moleskin.lighter,
  primary: baseColors.moleskin.main,
  secondary: baseColors.moleskin.light,
  tertiary: baseColors.moleskin.lighter,
  gray: baseColors.gray.dark,
  ...baseColors.accent,
};

export const spacing = {
  small: 8,
  medium: 16,
  large: 24,
};

export const fontSizes = {
  small: 12,
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
