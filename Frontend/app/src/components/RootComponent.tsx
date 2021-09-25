import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Box, useColorModeValue, useToken } from 'native-base';
import styleConfig from "./../../styleConfig.json"
import {useColorMode} from "native-base/src/core/color-mode/hooks";

export const Root = (props) => {
	const [lightBg, darkBg] = useToken(
		'colors',
		[styleConfig.backgroundColor.light, styleConfig.backgroundColor.dark],
		'blueGray.900',
	);
	const bgColor = useColorModeValue(lightBg, darkBg);
	const colorMode = useColorMode();

	const subroute = "";

	const linking = {
		prefixes: ['nothing'],
		config: {
			"Home": subroute+"home",
			"Auth": subroute+"login"
		}
	}

	return (
		<NavigationContainer
			linking={linking}
			theme={{
				// @ts-ignore
				colors: { background: bgColor },
			}}
		>
			<Box
				flex={1}
				w="100%"
				_light={{
					bg: 'coolGray.50',
				}}
				_dark={{
					bg: 'blueGray.900',
				}}
				// bg={useColorModeValue('', 'blueGray.900')}
				_web={{
					overflowX: 'hidden',
				}}
			>
				{props.children}
			</Box>
		</NavigationContainer>
	);
};
