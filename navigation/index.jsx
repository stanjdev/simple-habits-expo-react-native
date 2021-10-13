import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import React from 'react';

export default function Navigation({navigation}) {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};


import MySplashScreen from '../screens/MySplashScreen';
import TestScreen from '../screens/TestScreen';
import AddHabitScreen from '../screens/AddHabitScreen';
import HabitsLibraryScreen from '../screens/HabitsLibraryScreen';

const Stack = createStackNavigator();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen options={{headerShown:false, ...TransitionPresets.ScaleFromCenterAndroid }} name="MySplashScreen" component={MySplashScreen} />
      <Stack.Screen options={{headerShown:false, ...TransitionPresets.ScaleFromCenterAndroid }} name="TestScreen" component={TestScreen} />
      <Stack.Screen options={{headerShown:false, ...TransitionPresets.RevealFromBottomAndroid }} name="AddHabitScreen" component={AddHabitScreen} />
      <Stack.Screen options={{headerShown:false, ...TransitionPresets.RevealFromBottomAndroid }} name="HabitsLibraryScreen" component={HabitsLibraryScreen} />
    </Stack.Navigator>
  )
};