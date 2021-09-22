import React, {useEffect, useState} from "react";
import {Box, Button, Checkbox, CircleIcon, Icon, Input, Pressable, Text, useColorModeValue, View} from "native-base";
import App from "../../../App";
import axios from "axios";
import {Link} from "@react-navigation/native";
import {MaterialIcons} from "@expo/vector-icons";
import {ThemeInputText} from "../ThemeInputText";

const UNI_ROT = "#AC0634";
const MYUOS_GELB = "#fbb900";

export const Footer = (props) => {

	return(
		<View {...props}>
			<View style={{height: 200}} />
			{renderLoginTitle()}
			{renderHelptext()}
			<View style={{height: 30}} />
			{renderLoginForm()}
		</View>
	)
}