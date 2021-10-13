import React, { useState, useEffect } from 'react';
import { Text, View, Alert, StyleSheet, StatusBar, Dimensions, ImageBackground, TouchableOpacity, Image, ScrollView, TouchableWithoutFeedback} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import AppButton from '../components/AppButton';
const { width, height } = Dimensions.get('window');
import PresetButton from '../components/PresetButton';
const trashcan = require('../assets/screen-icons/trashcan.png');

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
    navigation.navigate("TestScreen");
  }

  useEffect(() => {
    setTimeout(async() => {
      let storedPresets = await AsyncStorage.getItem('presetsArray');
      // let presetsArr = storedPresets ? await JSON.parse(storedPresets) : sampleWorkouts;
      let presetsArr = storedPresets ? await JSON.parse(storedPresets) : new Array();
      setPresetsLib(presetsArr);
    }, 0)
  }, [])

  const sampleWorkouts = [
    {
      key: "1",
      presetName: "SAMPLE WORKOUT 1",
      numSets: 10,
      workTime: 180,
      restTime: 360,
    }, {
      key: "2",
      presetName: "FRIDAY HIIT",
      numSets: 10,
      workTime: 180,
      restTime: 360,
    }, {
      key: "3",
      presetName: "SLOW CHEST WORKOUT",
      numSets: 10,
      workTime: 180,
      restTime: 360,
    }, {
      key: "4",
      presetName: "SAMPLE WORKOUT 2",
      numSets: 10,
      workTime: 180,
      restTime: 360,
    }, {
      key: "5",
      presetName: "FRIDAY HIIT",
      numSets: 10,
      workTime: 180,
      restTime: 360,
    }, {
      key: "6",
      presetName: "SLOW CHEST WORKOUT",
      numSets: 10,
      workTime: 180,
      restTime: 360,
    }
  ];

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

  // useEffect(() => {

  // }, [deleteItem])


  const renderFrontItem = (data, i) => (
    <View>
      <PresetButton 
        key={data.item.presetName} 
        presetName={data.item.presetName} 
        sets={data.item.numSets}
        workTime={data.item.workTime}
        restTime={data.item.restTime}
        // onPress={() => navigation.navigate('TimerSetScreen', { presetInfo: data.item })}
        // IT SHOULD LAUNCH A NOTIFICATION FOR MANUAL LOGGING
        // LATER, IT SHOULD GO TO ITS OWN PROGRESS SCREEN.
        onPress={() => null}
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


  return (
    <View style={styles.container}>
      <StatusBar hidden={true}/>

      <View style={{ width: width, flexDirection: "row", alignItems: "center", marginTop: height < 700 ? 40 : height * 0.07, position: "absolute", zIndex: 100 }}>
        <TouchableOpacity onPress={goBack} style={{ padding: 15}}>
          <Image source={require('../assets/screen-icons/back-arrow-white.png')} style={{height: 20, marginLeft: 0}} resizeMode="contain"/>
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