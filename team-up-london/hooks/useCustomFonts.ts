import * as Font from 'expo-font';

export const useCustomFonts = () => {
  return Font.useFonts({
    'MyFont-Regular': require('../assets/fonts/Manrope-Regular.ttf'),
    'MyFont-Bold': require('../assets/fonts/Manrope-Bold.ttf'),
  });
};