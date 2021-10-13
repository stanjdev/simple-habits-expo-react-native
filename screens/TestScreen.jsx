import React, { useEffect, useState, useRef } from 'react';
import { Text, View, StatusBar, Image, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import AppButton from '../components/AppButton';
import { useIsFocused } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as Font from 'expo-font';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as Google from 'expo-google-app-auth';
import * as TaskManager from 'expo-task-manager';


import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    priority: 'high'
  }),
});


export default function TestScreen({ navigation, route }) {

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  let ACCESS_TOKEN = useRef();

  useEffect(() => {
    setTimeout(async () => {
      if (!ACCESS_TOKEN.current) {
        ACCESS_TOKEN.current = await signInWithGoogleAsync();
      }
    }, 0);

    registerForPushNotificationsAsync().then(token => console.log(token))
    .catch(err => console.error(err))

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });
    
    responseListener.current = Notifications.addNotificationResponseReceivedListener(async response => {
      // if (response.actionIdentifier == "expo.modules.notifications.actions.DEFAULT") return;
      
      console.log(response);

      const note = response.userText;
      const habit = await response.notification.request.content.data.habit;
      // console.log(note, habit);

      // Actual writing to Google Sheet
      await writeToSheet(habit, note);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
    
  }, [])

  
  async function schedulePushNotification() {
    await Notifications.setNotificationCategoryAsync("habit", [
        {
          actionId: "markDone",
          identifier: "markDone",
          buttonTitle: 'DONE',
          isDestructive: false,
          isAuthenticationRequired: false,
          options: {
            opensAppToForeground: false
          }
        },
        {
          actionId: "markDoneAndNote",
          identifier: "markDoneAndNote",
          buttonTitle: 'DONE + ADD NOTE',
          textInput: {
            submitButtonTitle: 'Submit Note',
          },
          isDestructive: false,
          isAuthenticationRequired: false,
          options: {
            opensAppToForeground: false
          }
        },
      ],
    );
    
    const testHabit = 'Water Plants';
    
    // const trigger = new Date();
    // trigger.setHours(9);
    // trigger.setMinutes(0);
    // trigger.setSeconds(0);
    // console.log(trigger);

    // let trigger = Date.now();
    // trigger += 5000;

    const habit1 = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Simple Habits 📬",
        body: `Did you do ${testHabit}?`,
        data: { 
          data: 'Some data goes here',
          habit: testHabit,
          'content-available': 1
        },
        priority: 'high',
        categoryIdentifier: 'habit',
        sound: 'default'
      },
      trigger: {
        // seconds: 0
      }
    });

    // await Notifications.cancelScheduledNotificationAsync(habit1);
  }

  async function calculateSecondsToSpecifiedDate(date) {
    
  };


  const pressButtonTest = async () => {
    if (!ACCESS_TOKEN.current) {
      ACCESS_TOKEN.current = await signInWithGoogleAsync();
    }
    if (ACCESS_TOKEN.current !== false) await schedulePushNotification();
    
    // let alarm = new Date();

    // console.log(alarm.getHours());
    // console.log(alarm.getMinutes() + 1);
    // console.log(alarm.getDay());
    // console.log(alarm.getSeconds());

  };
  
  const viewScheduled = async () => {
    // See what's scheduled (array): 
    console.log(await Notifications.getAllScheduledNotificationsAsync());
  }

  const killSwitch = async () => {
    // EMERGENCY KILL SWITCH
    console.log(await Notifications.cancelAllScheduledNotificationsAsync());
  };


  /* 
  1: Monday
  2: Tuesday
  3: Wednesday
  4: Thursday
  5: Friday
  6: Saturday
  7: Sunday
  */


  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    return token;
  }
  
  



  // PUT INTO PRIVATE ENV FILE!!!
  const sheetID = '1Z5V7z8_UtTlr0oNe1ljyQBhOCBvtOjh-rYA5Dr_meBM';
  const sheetName = 'simple-habits';
  const API_KEY = 'AIzaSyDu_JI0KmBRaMhi1OrluHyZIzOXwomMtAY';
  const IOS_CLIENT_ID = '938423599869-vp960btj8mlm4pmlgfu41q0jmo3b0j3l.apps.googleusercontent.com';





  const getSheetValues = async () => {
    const request = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${sheetName}?key=${API_KEY}`
    );
    const data = await request.json();
    console.log(data);
    return data;
  };


  // Requires Access Token
  const writeToSheet = async (habit, note='') => {
    // let [ACCESS_TOKEN, REFRESH_TOKEN] = await signInWithGoogleAsync();
    // let ACCESS_TOKEN = 'ya29.a0ARrdaM8xQPqAYjsfdsyhCjEeupFeRa9VeNHHrdr8-syzZSvIGllpqPtooAvTI00Mxnz99N4WGMNFkoftJrWBpamE3ghhAbKcfHMYPeahnqrPGwugZsRY9nljA5XyY_jnyOmV0Qzj8_SQtV5oC8bbWnLH-Xfs';

    console.log("current token:", ACCESS_TOKEN.current)

    // console.log(ACCESS_TOKEN);
    const request = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${sheetName}!A1:E1:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ACCESS_TOKEN.current}`,
        },
        body: JSON.stringify({
          "range": "simple-habits!A1:E1",
          "majorDimension": "ROWS",
          "values": [
            [habit, new Date(), note],
          ],
        }),
      }
    );
    const data = await request.json();
    console.log(data);
    return data;
  };




  async function signInWithGoogleAsync() {
    try {
      const result = await Google.logInAsync({
        // behavior: 'web',
        iosClientId: IOS_CLIENT_ID,
        //androidClientId: AND_CLIENT_ID,
        scopes: [
          'profile', 
          'email', 
          'https://www.googleapis.com/auth/spreadsheets',
        ],
      });

      if (result.type === 'success') {
        // console.log("refreshToken:", result.refreshToken)
        return result.accessToken;
      } else {
        return false;
      }
    } catch (e) {
      return { error: true };
    }
  }





  const [sets, setSets] = useState(4);
  const [workTime, setWorkTime] = useState(120);
  const [rest, setRest] = useState(180);

  const { presetInfo } = route.params;

  const onChange = async (value, state, setter) => {
    if (setter == setWorkTime || setter == setRest) {
      setter(Math.floor(value * 30));
    } else {
      setter(Math.floor(value));
    }
    if (value !== state) {
      await Haptics.selectionAsync();
    }
  };

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
        <Image source={require('../assets/screen-icons/library.png')} style={{ height: 13, width: 23 }} resizeMode="contain"/>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('AddHabitScreen', { sets, workTime, rest })} style={{ padding: 10, position: "absolute", top: height * 0.063, right: width * 0.05, zIndex: 100,  }}>
        <Image source={require('../assets/screen-icons/plus-symbol.png')} style={{height: 20, width: 20}} resizeMode="contain"/>
      </TouchableOpacity>

      <View style={{marginTop: 20}}>
        <Text style={ [{textAlign: "center", fontSize: 20, color: "#828282"}, styles.sourceCodeProMedium] }>Test Screen</Text>
        <View style={{flexDirection: "row", padding: 20}}>
          <View style={{backgroundColor: "black", flex: 1, height: height * 0.8, justifyContent: "space-around", alignItems: "center" }}>

            <AppButton 
              title="Test Notification"
              iconStyles={{height: 14, width: 11 }}
              buttonStyles={styles.yellowButton}
              buttonTextStyles={styles.buttonText}
              onPress={pressButtonTest}
            />
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