import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Alert, StyleSheet, StatusBar, Dimensions, ImageBackground, TouchableOpacity, Image, ScrollView, TouchableWithoutFeedback} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import AppButton from '../components/AppButton';
const { width, height } = Dimensions.get('window');
import PresetButton from '../components/PresetButton';
const trashcan = require('../assets/screen-icons/trashcan.png');
import Constants from 'expo-constants';
import * as Google from 'expo-google-app-auth';
import * as Notifications from 'expo-notifications';

import {sheetID, API_KEY, IOS_CLIENT_ID} from '@env';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    priority: 'high'
  }),
});


import AsyncStorage from '@react-native-async-storage/async-storage';

import { SwipeListView } from 'react-native-swipe-list-view';

export default function HabitsLibraryScreen ({ route, navigation }) {
  const isFocused = useIsFocused();

  let [fontsLoaded] = useFonts({
    'SourceCodePro-Regular': require('../assets/fonts/Source_Code_Pro/SourceCodePro-Regular.ttf'),
    'SourceCodePro-Medium': require('../assets/fonts/Source_Code_Pro/SourceCodePro-Medium.ttf'),
    'SourceCodePro-SemiBold': require('../assets/fonts/Source_Code_Pro/SourceCodePro-SemiBold.ttf'),
  });

  const [ presetsLib, setPresetsLib ] = useState([]);

  const goBack = () => {
    navigation.navigate("AddHabitScreen");
  }

  const { habitInfo } = route.params;

  useEffect(() => {
    setTimeout(async() => {
      let storedPresets = await AsyncStorage.getItem('presetsArray');
      let presetsArr = storedPresets ? await JSON.parse(storedPresets) : new Array();
      setPresetsLib(presetsArr);
    }, 0)
  }, [habitInfo]);

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) rowMap[rowKey].closeRow();
  };

  const deleteItem = (data, rowMap) => {
    Alert.alert("Delete this preset?", "This action cannot be undone.", [
      {text: "Delete", style: "cancel", onPress: async () => {
        // closeRow(rowMap, data.item.key);

        // get the AsyncStored array
        let storedPresets = await AsyncStorage.getItem('presetsArray');
        let presetsArr = await JSON.parse(storedPresets);
        
        // remove specific exercise from array
        let indexToDelete = presetsArr.map(preset => preset.key).indexOf(data.item.key);
        presetsArr.splice(indexToDelete, 1);

        // remove entire previous async stored array
        await AsyncStorage.removeItem('presetsArray');

        // to set a new array to async storage
        await AsyncStorage.setItem('presetsArray', JSON.stringify(presetsArr));
        setPresetsLib(presetsArr);
      }}, 
      {text: "Cancel", onPress: () => closeRow(rowMap, data.item.key)}
    ]);
  };

  const renderFrontItem = (data, i) => (
    <View>
      <PresetButton 
        key={data.item.habitName}
        habitName={data.item.habitName} 
        days={data.item.days}
        reminderTime={data.item.reminderTime}
        // onPress={() => navigation.navigate('TimerSetScreen', { habitInfo: data.item })}

        // IT SHOULD LAUNCH A NOTIFICATION FOR MANUAL LOGGING
        // LATER, IT SHOULD GO TO ITS OWN PROGRESS SCREEN.
        onPress={() => pressHabit(data.item.habitName)}
      />
    </View>
  );

  const renderHiddenItem = (data, rowMap) => (
    <TouchableWithoutFeedback onPress={() => deleteItem(data, rowMap)}>
      <View style={styles.rowBack}>
        <View style={{alignSelf: "flex-end", alignItems: "center", marginRight: 27 }}>
          <Image source={trashcan} style={{ height: 20, width: 20 }} resizeMode="contain"></Image>
          <Text style={[ styles.sourceCodeProMedium, { fontSize: 12, color: "white" }]}>DELETE</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );



/* NOTIFICATIONS LOGIC */  
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  let ACCESS_TOKEN = useRef();


  useEffect(() => {
    registerForPushNotificationsAsync().then(token => console.log('register for push notifs token:', token))
    .catch(err => console.error(err))

    /* NOTIFICATION RESPONSE LISTENERS */
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });
    
    responseListener.current = Notifications.addNotificationResponseReceivedListener(async response => {
      if (response.actionIdentifier == "expo.modules.notifications.actions.DEFAULT") return;

      const note = response.userText;
      const habit = await response.notification.request.content.data.habit;

      // Actual writing to Google Sheet
      await writeToSheet(habit, note);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [])


  /* ASK DEVICE FOR PERMISSION TO SEND NOTIFICATIONS */
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
    } else {
      console.log('Must use physical device for Push Notifications!');
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

  /* GOOGLE SIGN IN FOR ACCESS TOKEN */
  async function signInWithGoogleAsync() {
    try {
      const { type, accessToken, user, refreshToken } = await Google.logInAsync({
        iosClientId: IOS_CLIENT_ID,
        //androidClientId: AND_CLIENT_ID,
        scopes: [
          // 'profile', 
          // 'email', 
          'https://www.googleapis.com/auth/spreadsheets',
        ],
      });

      if (type === 'success') {
        return accessToken;
      } else {
        return false;
      }
    } catch (e) {
      return { error: true };
    }
  }


  /* SCHEDULE NOTIFICATION */
  async function schedulePushNotification(habitName) {
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
    
    // const trigger = new Date();
    // trigger.setHours(9);
    // trigger.setMinutes(0);
    // trigger.setSeconds(0);
    // console.log(trigger);

    // let trigger = Date.now();
    // trigger += 5000;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Simple Habits 📬",
        body: `Did you do: ${habitName}?`,
        data: { 
          data: 'Some data goes here',
          habit: habitName,
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
  }


    // Could be customizable:
    const sheetName = 'simple-habits';
    
    /* SHEET OPERATIONS: */
    // READ:
    const getSheetValues = async () => {
      const request = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${sheetName}?key=${API_KEY}`
      );
      const data = await request.json();
      return data;
    };
  
    // WRITE: (Requires Access Token)
    const writeToSheet = async (habit, note='') => {
      try {
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
                [habit, Date(), note],
              ],
            }),
          }
        );
        const data = await request.json();
        return data;
      } catch (err) {
        console.log(err);
      }
    };
  

 /* PRESS A HABIT ACTION */
  const pressHabit = async (habitName) => {
    if (!ACCESS_TOKEN.current) {
      ACCESS_TOKEN.current = await signInWithGoogleAsync();
    }
    if (ACCESS_TOKEN.current !== false) await schedulePushNotification(habitName);
  };


  return (
    <View style={styles.container}>
      <StatusBar hidden={true}/>

      <View style={{ width: width, flexDirection: "row", alignItems: "center", marginTop: height < 700 ? 40 : height * 0.07, position: "absolute", zIndex: 100 }}>
        <TouchableOpacity onPress={() => navigation.navigate('AddHabitScreen')} style={{ padding: 15, paddingLeft: 0}}>
          <Image source={require('../assets/screen-icons/plus-symbol.png')} style={{height: 20, }} resizeMode="contain"/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('TestScreen')} style={{ padding: 10, position: "absolute", top: height * 0.007, right: width * 0.05, zIndex: 100,  }}>
          <Image source={require('../assets/screen-icons/gear-grey.png')} style={{ height: 27, width: 27 }} resizeMode="contain"/>
        </TouchableOpacity>
        <Text style={[{textAlign: "center", fontSize: 20, color: "#E0E0E0", position: "absolute", zIndex: -1, width: width}, styles.sourceCodeProMedium]}>Saved Habits</Text>        
      </View>


    {presetsLib.length ? 
      <View style={{ alignItems: "center", marginTop: height * 0.17, marginBottom: height * 0.05 }}>
        <SwipeListView
          data={presetsLib}
          renderItem={renderFrontItem}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-95}
          leftOpenValue={0}
          previewRowKey={'0'}
          previewOpenValue={-40}
          previewOpenDelay={3000}
          disableRightSwipe={true}
          // onRowOpen={rowKey => console.log(`opened ${rowKey}`)}
        />
      </View>
    :
      <View style={{height: height, width: width, justifyContent: "center", alignItems: "center" }}>
        {/* <ImageBackground source={bgImage} style={styles.image}> */}
          <Text style={[styles.titleText, styles.sourceCodeProMedium]}>NO SAVED HABITS</Text>
        {/* </ImageBackground> */}
        <AppButton 
          title={"ADD HABIT TO TRACK"}
          buttonStyles={[styles.button, styles.buttonColor]}
          buttonTextStyles={[styles.buttonText, styles.sourceCodeProMedium]}
          onPress={goBack}
        />
      </View>
    }
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  image: {
    height: 312,
    width: 312,
    resizeMode: "contain",
    justifyContent: "center",
    alignItems: "center",
    // transform: [{rotateY: "180deg"}]
  },
  button: {
    height: 47,
    width: width * 0.8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowRadius: 7,
    shadowColor: "black",
    shadowOpacity: 0.2,
    shadowOffset: {width: 3, height: 3},
    position: "absolute",
    bottom: height * 0.1
  },
  buttonColor: {
    backgroundColor: "#87CEFA",
  },
  buttonText: {
    color: "#000",
    flex: 1,
    textAlign: "center",
    fontSize: 19,
  },
  titleText: {
    color: "white",
    fontSize: 24,
    // transform: [{rotateY: "180deg"}]
  },
  subTitleText: {
    color: "#828282",
    fontSize: 20,
  },
  sourceCodeProMedium: {
    fontFamily: 'SourceCodePro-Medium'
  },
  rowBack: {
    backgroundColor: 'maroon',
    height: 90,
    width: width * 0.8,
    alignSelf: "flex-end",
    borderRadius: 8,
    justifyContent: "center",
    marginTop: 7,
    marginBottom: 7
  }
});