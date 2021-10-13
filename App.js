import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Font from 'expo-font';

import Navigation from './navigation';
import * as SplashScreen from 'expo-splash-screen';

export default function App() {

  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      // SourceCodePro: require('./assets/fonts/Source_Code_Pro/SourceCodePro-Regular.ttf'),
      'SourceCodePro-Regular': require('./assets/fonts/Source_Code_Pro/SourceCodePro-Regular.ttf'),
      'SourceCodePro-Medium': require('./assets/fonts/Source_Code_Pro/SourceCodePro-Medium.ttf'),
      'SourceCodePro-SemiBold': require('./assets/fonts/Source_Code_Pro/SourceCodePro-SemiBold.ttf'),
    })
    setFontsLoaded(true);
  };
  useEffect(() => {
    loadFonts();
  }, [])

  // useEffect(() => {
  //   setTimeout(async () => {
  //     try {
  //       await SplashScreen.preventAutoHideAsync();
  //     } catch (error) {
  //       console.warn(error);
  //     }
  //   }, 0);

  //   return () => SplashScreen.hideAsync();
  // }, [])

  // useEffect(() => {
  //   setTimeout(async () => {
  //     await SplashScreen.preventAutoHideAsync();
  //     // await SplashScreen.hideAsync();
  //   }, 0);
  //   return () => SplashScreen.hideAsync();
  // }, [])
  
  return fontsLoaded ? (
    <SafeAreaProvider>
      <Navigation />
      <StatusBar style="none"/>
    </SafeAreaProvider>
  ) : null
}