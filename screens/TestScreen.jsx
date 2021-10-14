import React, { useEffect, useState, useRef } from 'react';
import { Text, View, StatusBar, Image, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import AppButton from '../components/AppButton';
import { useIsFocused } from '@react-navigation/native';
import { useFonts } from 'expo-font';
const { width, height } = Dimensions.get('window');
import Constants from 'expo-constants';
import * as Google from 'expo-google-app-auth';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    priority: 'high'
  }),
});

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TestScreen({ navigation, route }) {





  
  
  const viewScheduled = async () => {
    // See what's scheduled (array): 
    console.log(await Notifications.getAllScheduledNotificationsAsync());
  }

  const killSwitch = async () => {
    // EMERGENCY KILL SWITCH
    console.log(await Notifications.cancelAllScheduledNotificationsAsync());
  };












/*  */





  const isFocused = useIsFocused();

  let [fontsLoaded] = useFonts({
    'SourceCodePro-Regular': require('../assets/fonts/Source_Code_Pro/SourceCodePro-Regular.ttf'),
    'SourceCodePro-Medium': require('../assets/fonts/Source_Code_Pro/SourceCodePro-Medium.ttf'),
    'SourceCodePro-SemiBold': require('../assets/fonts/Source_Code_Pro/SourceCodePro-SemiBold.ttf'),
  });


  return (
    <View style={{ flex: 1, resizeMode: "cover", justifyContent: "center", backgroundColor: "black" }}>
      {isFocused ? <StatusBar hidden={false} barStyle="light-content"/> : null} 
      <TouchableOpacity onPress={() => navigation.navigate('HabitsLibraryScreen')} style={{ padding: 10, position: "absolute", top: height * 0.068, zIndex: 100, left: 10,   }}>
        <Image source={require('../assets/screen-icons/back-arrow-white.png')} style={{ height: 13, width: 23 }} resizeMode="contain"/>
      </TouchableOpacity>
      {/* <TouchableOpacity onPress={() => navigation.navigate('AddHabitScreen', { sets, workTime, rest })} style={{ padding: 10, position: "absolute", top: height * 0.063, right: width * 0.05, zIndex: 100,  }}>
        <Image source={require('../assets/screen-icons/plus-symbol.png')} style={{height: 20, width: 20}} resizeMode="contain"/>
      </TouchableOpacity> */}

      <View style={{marginTop: 20}}>
        <Text style={ [{textAlign: "center", fontSize: 20, color: "#828282"}, styles.sourceCodeProMedium] }>Test Screen</Text>
        <View style={{flexDirection: "row", padding: 20}}>
          <View style={{backgroundColor: "black", flex: 1, height: height * 0.8, justifyContent: "space-around", alignItems: "center" }}>

            {/* <AppButton 
              title="Test Notification"
              iconStyles={{height: 14, width: 11 }}
              buttonStyles={styles.yellowButton}
              buttonTextStyles={styles.buttonText}
              onPress={pressButtonTest}
            /> */}
            <AppButton 
              title="Log Scheduled"
              iconStyles={{height: 14, width: 11 }}
              buttonStyles={styles.yellowButton}
              buttonTextStyles={styles.buttonText}
              onPress={viewScheduled}
            />
            <AppButton 
              title="Kill Switch"
              iconStyles={{height: 14, width: 11 }}
              buttonStyles={styles.yellowButton}
              buttonTextStyles={styles.buttonText}
              onPress={killSwitch}
            />

          </View>
        </View>
      </View>

      
    </View>
  )
};


const styles = StyleSheet.create({
  yellowButton: {
    backgroundColor: "#87CEFA",
    height: 47,
    width: width * 0.8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowRadius: 7,
    shadowColor: "black",
    shadowOpacity: 0.2,
    shadowOffset: {width: 3, height: 3},
  },
  buttonText: {
    color: "#000",
    // flex: 1,
    // textAlign: "center",
    paddingLeft: 13,
    fontSize: 19,
    letterSpacing: 1,
    fontFamily: "SourceCodePro-Medium"
  },
  sourceCodeProRegular: {
    fontFamily: "SourceCodePro-Regular"
  },
  sourceCodeProSemiBold: {
    fontFamily: "SourceCodePro-SemiBold"
  },
  sourceCodeProMedium: {
    fontFamily: "SourceCodePro-Medium"
  }
});