import React from 'react';
import { TouchableOpacity, View, Text, Image } from 'react-native';

const AppButton = ({onPress, title, buttonStyles, buttonTextStyles, icon, iconStyles, name, size, color, disabled}) => (
  <TouchableOpacity onPress={onPress} style={buttonStyles} disabled={disabled || false}>
    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center", paddingLeft: 25, paddingRight: 25}}>
      {icon ? <Image source={icon} style={iconStyles} resizeMode="contain"></Image> : null}
      <Text style={[buttonTextStyles, {paddingLeft: icon ? 13 : 0}]}>{title}</Text>
    </View>
  </TouchableOpacity>
);

export default AppButton;