import React, { useState } from 'react';
import { Text, View, StatusBar, Image, Dimensions, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import AppButton from '../components/AppButton';
import { useIsFocused } from '@react-navigation/native';
import { useFonts } from 'expo-font';

import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function SavePresetScreen({ navigation, route }) {
  const isFocused = useIsFocused();

  let [fontsLoaded] = useFonts({
    'SourceCodePro-Regular': require('../assets/fonts/Source_Code_Pro/SourceCodePro-Regular.ttf'),
    'SourceCodePro-Medium': require('../assets/fonts/Source_Code_Pro/SourceCodePro-Medium.ttf'),
    'SourceCodePro-SemiBold': require('../assets/fonts/Source_Code_Pro/SourceCodePro-SemiBold.ttf'),
  });
    
  const { sets, workTime, rest } = route.params;

  const [ presetInfo, setPresetInfo ] = useState({
    presetName: "",
    numSets: sets,
    workTime: workTime,
    restTime: rest,
    key: ""
  });

  const presetNameInputChange = value => {
    if (value.length !== 0) {
      setPresetInfo({
        ...presetInfo,
        presetName: value,
        key: value
      });
    } else {
      setPresetInfo({
        ...presetInfo,
        presetName: ""
      })
    }
  };

  const [ saveButtonPressed, setSaveButtonPressed ] = useState(false);

  async function saveAndGoBack(presetInfo) {
    setSaveButtonPressed(true);

    // await AsyncStorage.removeItem('presetsArray');
    
    // Store into localStorage
    let storedPresets = await AsyncStorage.getItem('presetsArray');
    let presetsArr = storedPresets ? await JSON.parse(storedPresets) : new Array();
    
    // if there isn't a duplicate, store it normally: , else auto-generate a suffix to the key and name.
    await presetsArr.push(presetInfo);
    await AsyncStorage.setItem('presetsArray', JSON.stringify(presetsArr));
    // console.log("presetsArr:", presetsArr);
    
    setTimeout(() => {
      navigation.navigate('HabitsLibraryScreen', { presetInfo });
    }, 1000)
  };

  return (
    <View style={{ flex: 1, resizeMode: "cover", justifyContent: "center", backgroundColor: "black" }}>
      {isFocused ? <StatusBar hidden={false} barStyle="light-content"/> : null} 
      <TouchableOpacity onPress={() => navigation.navigate('TestScreen')} style={{position: "absolute", top: height * 0.065, zIndex: 100, padding: 15}}>
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
                  onChangeText={value => presetNameInputChange(value)} 
                  autoCapitalize="characters"
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
                  <View style={styles.daySelect}>
                    <Text style={styles.daySelectText}>Su</Text>
                  </View>
                  <View style={styles.daySelect}>
                    <Text style={styles.daySelectText}>M</Text>
                  </View>
                  <View style={styles.daySelect}>
                    <Text style={styles.daySelectText}>Tu</Text>
                  </View>
                  <View style={styles.daySelect}>
                    <Text style={styles.daySelectText}>W</Text>
                  </View>
                  <View style={styles.daySelect}>
                    <Text style={styles.daySelectText}>Th</Text>
                  </View>
                  <View style={styles.daySelect}>
                    <Text style={styles.daySelectText}>Fr</Text>
                  </View>
                  <View style={styles.daySelect}>
                    <Text style={styles.daySelectText}>Sa</Text>
                  </View>
                </View>
                <View style={styles.dailySelect}>
                  <Text style={styles.dailySelectText}>DAILY</Text>
                </View>
              </View>


              <View style={styles.prompt}>
                <Text style={{textAlign: "center", fontSize: 14, fontFamily: "SourceCodePro-Medium", color: "#FFF"}}>When would you like to be reminded? </Text>
                <TextInput 
                  placeholder="8:00 AM"
                  placeholderTextColor="#828282"
                  onChangeText={value => presetNameInputChange(value)} 
                  autoCapitalize="characters"
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

            </View>

            <AppButton 
              title={saveButtonPressed ? "SAVING..." : "SAVE"}
              buttonStyles={[styles.buttonStyle, !presetInfo.presetName || saveButtonPressed ? styles.disabledButton : styles.buttonColor]}
              buttonTextStyles={styles.buttonText}
              disabled={!presetInfo.presetName || saveButtonPressed}
              onPress={() => saveAndGoBack(presetInfo)}
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
    backgroundColor: '#333333',
    borderRadius: 8,
    height: 35,
    width: 35,
    display: 'flex',
    justifyContent: 'center',
    marginTop: 5,
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