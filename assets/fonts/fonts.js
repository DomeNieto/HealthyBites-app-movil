// fonts.js
import * as Font from 'expo-font';

export const loadFonts = () =>
  Font.loadAsync({
    'InstrumentSans-Regular': require('./InstrumentSans-Regular.ttf'),
    'InstrumentSans-Bold': require('./InstrumentSans-Bold.ttf'),
  });
