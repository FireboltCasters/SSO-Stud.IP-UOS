import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Box, useColorModeValue, useToken } from 'native-base';
import styleConfig from "./../../styleConfig.json"
import Auth from "../myComponents/auth/Auth";
import {MasonLayout} from "../screens";
import {useColorMode} from "native-base/src/core/color-mode/hooks";
import ColorModeWrapper from "./ColorModeWrapper";

export const Root = (props) => {
	const [lightBg, darkBg] = useToken(
		'colors',
		[styleConfig.backgroundColor.light, styleConfig.backgroundColor.dark],
		'blueGray.900',
	);
	const bgColor = useColorModeValue(lightBg, darkBg);
	const colorMode = useColorMode();

	const linking = {
		prefixes: ['http://127.0.0.1:19006/'],
		config: {
			"Home": "",
			"Auth": "studip/login"
		}
	}

	return (
		<ColorModeWrapper colorMode={colorMode}>
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
		</ColorModeWrapper>
	);
};
