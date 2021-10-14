import React, { useEffect, useState } from 'react';
import { Text, View, StatusBar, Image, Dimensions, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import AppButton from '../components/AppButton';
import { useIsFocused } from '@react-navigation/native';
import { useFonts } from 'expo-font';

import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

const { width, height } = Dimensions.get('window');

export default function SavePresetScreen({ navigation, route }) {
  const isFocused = useIsFocused();

  let [fontsLoaded] = useFonts({
    'SourceCodePro-Regular': require('../assets/fonts/Source_Code_Pro/SourceCodePro-Regular.ttf'),
    'SourceCodePro-Medium': require('../assets/fonts/Source_Code_Pro/SourceCodePro-Medium.ttf'),
    'SourceCodePro-SemiBold': require('../assets/fonts/Source_Code_Pro/SourceCodePro-SemiBold.ttf'),
  });

  const [ dateTime, setDateTime ] = useState(new Date());
  const [ selectedDays, setSelectedDays ] = useState([]);
  const [ habitInfo, setHabitInfo ] = useState({
    habitName: "",
    days: selectedDays,
    reminderTime: `${dateTime.getHours() > 12 ? dateTime.getHours() - 12 : dateTime.getHours()}:${dateTime.getMinutes() <= 9 ? '0' + dateTime.getMinutes() : dateTime.getMinutes()} ${dateTime.getHours() >= 12 ? 'PM' : 'AM'}`,
    key: ""
  });

  const habitNameInputChange = value => {
    if (value.length !== 0) {
      setHabitInfo({
        ...habitInfo,
        habitName: value,
        key: value
      });
    } else {
      setHabitInfo({
        ...habitInfo,
        habitName: ""
      })
    }
  };

  const habitTimeInputChange = (evt, selectedTime) => {
    const time = selectedTime || dateTime;
    const timeString = `${dateTime.getHours() > 12 ? dateTime.getHours() - 12 : dateTime.getHours()}:${time.getMinutes() <= 9 ? '0' + time.getMinutes() : time.getMinutes()} ${time.getHours() >= 12 ? 'PM' : 'AM'}`;
    setHabitInfo({
      ...habitInfo,
      reminderTime: timeString,
      key: timeString
    });
    setDateTime(time);
  };

  const [ saveButtonPressed, setSaveButtonPressed ] = useState(false);

  async function saveAndGoBack(habitInfo) {
    setSaveButtonPressed(true);
    // await AsyncStorage.removeItem('presetsArray');
    
    // Store into localStorage
    let storedPresets = await AsyncStorage.getItem('presetsArray');
    let presetsArr = storedPresets ? await JSON.parse(storedPresets) : new Array();
    
    // if there isn't a duplicate, store it normally: , else auto-generate a suffix to the key and name.
    await presetsArr.push(habitInfo);
    await AsyncStorage.setItem('presetsArray', JSON.stringify(presetsArr));
    // console.log("presetsArr:", presetsArr);
    
    setTimeout(async () => {
      await navigation.navigate('HabitsLibraryScreen', { habitInfo });
    }, 1000)
  };


  const DAYS = {
    'Su': 7,
    'M': 1,
    'Tu': 2,
    'W': 3,
    'Th': 4,
    'Fr': 5,
    'Sa': 6,
  }

  const toggleDaySelected = (day) => {
    if (!selectedDays.includes(day)) {
      setSelectedDays(() => [...selectedDays, day])
    }
    else {
      const idxToRemove = selectedDays.indexOf(day);
      selectedDays.splice(idxToRemove, 1);
      setSelectedDays([...selectedDays])
    }
    // setHabitInfo({
    //   ...habitInfo,
    //   days: selectedDays,
    // });
  };

  const toggleDailyButton = () => {
    if (selectedDays.length < 7) setSelectedDays(Object.keys(DAYS));
    else setSelectedDays([]);
    // setHabitInfo({
    //   ...habitInfo,
    //   days: selectedDays,
    // });
  };

  useEffect(() => {
    setHabitInfo({
      ...habitInfo,
      days: selectedDays,
    });
    console.log(selectedDays)
  }, [selectedDays])

  const renderDayPicker = () => {
    const elements = [];
    const arr = Object.keys(DAYS);
    for (let day of arr) {
      elements.push(
        <TouchableWithoutFeedback
          key={day}
          onPress={() => toggleDaySelected(day)}
        >
          <View style={[styles.daySelect, selectedDays.includes(day) ? styles.selected : styles.unselected]} >
              <View>
                <Text style={styles.buttonText}>TouchableWithoutFeedback</Text>
              </View>
            <Text style={styles.daySelectText}>{day}</Text>
          </View>
        </TouchableWithoutFeedback>
      )
    }
    return elements;
  };


  return (
    <View style={{ flex: 1, resizeMode: "cover", justifyContent: "center", backgroundColor: "black" }}>
      {isFocused ? <StatusBar hidden={false} barStyle="light-content"/> : null} 
      <TouchableOpacity onPress={() => navigation.navigate('HabitsLibraryScreen')} style={{position: "absolute", top: height * 0.065, zIndex: 100, padding: 15}}>
        <Image source={require('../assets/screen-icons/library.png')} style={{height: 13, width: 23 }} resizeMode="contain"/>
      </TouchableOpacity>

      <View>
        <View style={{flexDirection: "row"}}>
          <View style={{backgroundColor: "black", flex: 1, height: height * 0.9, alignItems: "center", justifyContent: 'space-evenly', }}>
            
            <View style={{ alignItems: "center", justifyContent: "space-between", height: 380, marginBottom: height > 700 ? 175 : 100 }}>
              <Text style={ [{textAlign: "center", fontSize: 20, color: "#828282", marginBottom: 70}, styles.sourceCodeProMedium] }>Add Habit</Text>

              <View style={styles.prompt}>
                <Text style={{textAlign: "center", fontSize: 14, fontFamily: "SourceCodePro-Medium", color: "#FFF" }}>What habit do you want to track?</Text>
                <TextInput 
                  placeholder="NEW HABIT"
                  placeholderTextColor="#828282"
                  onChangeText={value => habitNameInputChange(value)} 
                  // autoCapitalize="characters"
                  autoFocus
                  autoCorrect={false}
                  style={[{ 
                    backgroundColor: "#333333", 
                    color: "#FFFFFF", 
                    fontSize: 24, 
                    textAlign: "center", 
                    height: 40, 
                    width: width * 0.9, 
                    borderRadius: 8,
                    marginTop: 15
                }, styles.sourceCodeProMedium]}>
                </TextInput>
              </View>

              <View style={styles.prompt}>
                <Text style={{textAlign: "center", fontSize: 14, fontFamily: "SourceCodePro-Medium", color: "#FFF"}}>Frequency to track it: </Text>
                <View style={[{flexDirection: "row", justifyContent: "space-between", width: width * 0.85, }]}>
                  {renderDayPicker()}
                </View>

                <TouchableOpacity
                  key={'daily'}
                  onPress={toggleDailyButton}
                >
                  <View style={styles.dailySelect}>
                    <Text style={styles.dailySelectText}>DAILY</Text>
                  </View>
                </TouchableOpacity>

              </View>


              <View style={styles.prompt}>
                <Text style={{textAlign: "center", fontSize: 14, fontFamily: "SourceCodePro-Medium", color: "#FFF"}}>When would you like to be reminded? </Text>
                <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 15 }}>
                  <DateTimePicker
                    style={{ backgroundColor: '#444',  width: 100}}
                    textColor="light"
                    themeVariant="light"
                    testID="dateTimePicker"
                    // value={new Date()}
                    value={dateTime}
                    mode='time'
                    is24Hour={true}
                    display="default"
                    onChange={habitTimeInputChange}
                  />
                </View>
              </View>

            </View>

            <AppButton 
              title={saveButtonPressed ? "SAVING..." : "SAVE"}
              buttonStyles={[styles.buttonStyle, !habitInfo.habitName || saveButtonPressed ? styles.disabledButton : styles.buttonColor]}
              buttonTextStyles={styles.buttonText}
              disabled={!habitInfo.habitName || saveButtonPressed}
              onPress={() => saveAndGoBack(habitInfo)}
            />

          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  buttonStyle: {
    height: 47,
    width: width * 0.8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowRadius: 7,
    shadowColor: "black",
    shadowOpacity: 0.2,
    shadowOffset: {width: 3, height: 3}
  },
  buttonColor: {
    backgroundColor: "#87CEFA",
  },
  disabledButton: {
    // backgroundColor: "rgba(250, 255, 0, 0.5)",
    backgroundColor: "rgba(135, 206, 250, 0.5)",
    
  },
  buttonText: {
    color: "#000",
    flex: 1,
    textAlign: "center",
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
  },
  daySelect: {
    borderRadius: 8,
    height: 35,
    width: 35,
    display: 'flex',
    justifyContent: 'center',
    marginTop: 5,
  },
  unselected: {
    backgroundColor: '#333',
  },
  selected: {
    backgroundColor: '#87CEFA',
  },
  daySelectText: {
    fontSize: 14, 
    fontFamily: "SourceCodePro-Medium", 
    color: "#FFF",
    alignSelf: 'center'
  },
  dailySelect: {
    backgroundColor: '#333333',
    borderRadius: 8,
    height: 35,
    // width: width * 0.8,
    display: 'flex',
    justifyContent: 'center',
    marginTop: 15,
  },
  dailySelectText: {
    alignSelf: 'center',
    fontSize: 14, 
    fontFamily: "SourceCodePro-Medium", 
    color: "#FFF",
  },
  prompt: {
    // height: 70,
    // marginTop: 20,
    marginBottom: 50,
    justifyContent: 'space-between',
    // borderColor: 'orange',
    // borderWidth: 1
  }
});