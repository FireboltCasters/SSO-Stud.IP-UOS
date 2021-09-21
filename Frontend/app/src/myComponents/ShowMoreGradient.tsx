import React from "react";
import {Box, Button, Fab, Icon, Text, useColorModeValue, useToken, View} from "native-base";
import {StackNavigationProp} from "@react-navigation/stack";
import styleConfig from "../../styleConfig.json";
import {LinearGradient} from "expo-linear-gradient";
import ShowMoreGradientPlaceholder from "./ShowMoreGradientPlaceholder";
import {AntDesign, Ionicons} from "@expo/vector-icons";

export function ShowMoreGradient() {
	const [lightBg, darkBg] = useToken(
		'colors',
		[styleConfig.backgroundColor.light, styleConfig.backgroundColor.dark],
		'blueGray.900',
	);
	const bgColor = useColorModeValue(lightBg, darkBg);
	const gradColors = [bgColor+'00', bgColor+'FF'];

	return (
		<View style={[{width: "97%", position: "absolute", bottom: 0, height: "auto"}]}>
			<ShowMoreGradientPlaceholder />
			<View style={{position: "absolute", height: "100%", width: "100%", bottom: 0}}>
				<LinearGradient
					style={{flex: 4}}
					colors={gradColors}
					pointerEvents={'none'}
				/>
				<View style={{flex: 1, backgroundColor: bgColor}} />
			</View>
		</View>
	);
}