import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Fab, useColorMode, Icon, Text } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { Logo } from '../components/Logo';

export const ColorStatusBar = () => {
	const { colorMode, toggleColorMode } = useColorMode();

	return (
			<StatusBar
				style={colorMode === 'dark' ? 'light' : 'dark'}
				backgroundColor={colorMode == 'dark' ? '#27272a' : '#f3f2f2'}
				translucent={true}
			/>
	);
};
