import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Box, useColorModeValue, useToken } from 'native-base';
import styleConfig from "./../../styleConfig.json"
import {useColorMode} from "native-base/src/core/color-mode/hooks";
import EnviromentHelper from "../myComponents/EnviromentHelper";

export const Root = (props) => {
	const [lightBg, darkBg] = useToken(
		'colors',
		[styleConfig.backgroundColor.light, styleConfig.backgroundColor.dark],
		'blueGray.900',
	);
	const bgColor = useColorModeValue(lightBg, darkBg);

	let subroute = "";
	try{
		let basePath = EnviromentHelper.getBasePath();
		subroute = basePath;
	} catch (err){
		console.log("Trying to get Basepath");
		console.log(err)
	}

	const linking = {
		prefixes: ['nothing'], // i think this is needed, test in production !
		config: {
			"Home": subroute+"home",
			"Auth": subroute+"login"
		}
	}

	return (
		<NavigationContainer
			key={"NavigationContainer"}
			linking={linking}
			theme={{
				// @ts-ignore
				colors: { background: bgColor },
			}}
		>
			<Box
				_light={{
					bg: 'coolGray.50',
				}}
				_dark={{
					bg: 'blueGray.900',
				}}
				// bg={useColorModeValue('', 'blueGray.900')}
				_web={{
					// overflowX: 'hidden', // causes in Firefox unter Windows 10 shaking
				}}
				style={{height: "100%", width: "100%"}}
			>
				{props.children}
			</Box>
		</NavigationContainer>
	);
};
