import React from 'react';
import { TouchableOpacity, View, Text, Image, Dimensions, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useFonts } from 'expo-font';
const { width, height } = Dimensions.get('window');


export default function PresetButton ({onPress, habitName, days=['Daily'], reminderTime }) {

  let [fontsLoaded] = useFonts({
    'SourceCodePro-Regular': require('../assets/fonts/Source_Code_Pro/SourceCodePro-Regular.ttf'),
    'SourceCodePro-Medium': require('../assets/fonts/Source_Code_Pro/SourceCodePro-Medium.ttf'),
    'SourceCodePro-SemiBold': require('../assets/fonts/Source_Code_Pro/SourceCodePro-SemiBold.ttf'),
  });

  return (
    <TouchableWithoutFeedback onPress={onPress} >
      <View style={styles.button}>
          <View style={{flexDirection: "column"}}>
            <Text style={[styles.habitNameTextStyle, styles.sourceCodeProMedium]}>{habitName}</Text>
            <View style={[styles.subTextStyle]}>
              <Text style={styles.subTextFont}>{days.length === 7 ? 'Daily' : days.toString()}</Text>
              <Text style={styles.subTextFont}>{reminderTime}</Text>
            </View>
          </View>
      </View>
    </TouchableWithoutFeedback>
  );
};


const styles = StyleSheet.create({
  button: {
    backgroundColor: "#333333",
    height: 90,
    width: width * 0.88,
    borderRadius: 8,
    justifyContent: "center",
    marginTop: 7,
    marginBottom: 7
  },
  habitNameTextStyle: {
    fontSize: 24,
    color: "#FFFFFF",
    width: width * 0.88,
    paddingLeft: 18, 
    // borderWidth: 1,
    // borderColor: "orange"
  },
  subTextStyle: {
    flexDirection: "row", 
    justifyContent: "space-between", 
    paddingLeft: 18, 
    paddingRight: 18, 
    paddingTop: 8,
    width: width * 0.88, 
    // borderWidth: 1,
    // borderColor: "lightgreen"
  },
  subTextFont: { 
    fontSize: 14, 
    fontFamily: "SourceCodePro-Medium", 
    color: "#FFF" 
  },
  sourceCodeProMedium: {
    fontFamily: 'SourceCodePro-Medium'
  },
});