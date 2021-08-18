import { generateTheme } from '../themeGenerator';

export const vvkTheme = generateTheme({
  // Colors
  primary: '#39e09b',
  secondary: '#6D9AFF',

  // Palettes
  gray: {
    10: '#0f111a', // Darkest
    9: '#1C1D21',
    8: '#252A41',
    7: '#3D435C',
    6: '#575C75',
    5: '#73778C',
    4: '#9EA1B2',
    3: '#B9BBC6',
    2: '#D5D6DD',
    1: '#EAEBED', // Lightest
  },
  palette: {
    white: '#ffffff',
    black: '#000000',
    green: '#00e676',
    yellow: '#eeff41',
    red: '#ff3b30',
  },
  text: {
    heading: '#CBCDD2',
    default: '#A6ACCD',
    subheading: '#abafc7',
    fade: '#9196B3',
    disabled: '#7f8288',
    accent: '#77cfa3',
  },
});