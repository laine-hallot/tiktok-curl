import {Appearance} from 'react-native';

const rootColors = {
  red: '#fc5d62', // error
  white: '#ffffff',
  lightGray: '#dadde1', // borders
  mediumGray: '#85888c', // shadows
  darkGray: '#383a3c', // regular text
  black: '#000000',
  lightBlue: '#4489bb',
  blue: '#0095ff',
  lightPurple: '#a162c6',
  purple: '#b12dfc',
  green: '#C2FFDF',
};

const lightColors = {
  ...rootColors,
  appBackground: '#fefefe',
  regularText: rootColors.darkGray,
  errorText: rootColors.red,
  successText: rootColors.green,
  primaryDivBackground: rootColors.white,
  shadow: rootColors.mediumGray,
  borderColor: rootColors.lightGray,
  buttonPrimary: rootColors.blue,
  buttonPrimaryDisabled: rootColors.lightBlue,
  buttonSecondary: rootColors.purple,
  buttonSecondaryDisabled: rootColors.lightPurple,
};

const darkColors = {
  ...rootColors,
  appBackground: '#1f1f1f',
  regularText: 'lightgray',
  errorText: rootColors.red,
  successText: rootColors.green,
  primaryDivBackground: rootColors.black,
  shadow: rootColors.mediumGray,
  borderColor: rootColors.lightGray,
  buttonPrimary: rootColors.blue,
  buttonPrimaryDisabled: rootColors.lightBlue,
  buttonSecondary: rootColors.purple,
  buttonSecondaryDisabled: rootColors.lightPurple,
};

//export const colors = false ? darkColors : lightColors;
export const colors =
  Appearance.getColorScheme() === 'dark' ? darkColors : lightColors;
