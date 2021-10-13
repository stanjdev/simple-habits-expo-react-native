import React from 'react';
import { TouchableOpacity, View, Text, Image, TouchableWithoutFeedback } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

const AppButton = ({onPress, title, buttonStyles, buttonTextStyles, icon, iconStyles, name, size, color, disabled}) => (
  <TouchableOpacity onPress={onPress} style={buttonStyles} disabled={disabled || false}>
    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center", paddingLeft: 25, paddingRight: 25}}>
      {icon ? <Image source={icon} style={iconStyles} resizeMode="contain"></Image> : null}
      <Text style={[buttonTextStyles, {paddingLeft: icon ? 13 : 0}]}>{title}</Text>
    </View>
  </TouchableOpacity>
);

export default AppButton;