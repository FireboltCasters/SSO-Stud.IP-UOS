import React from 'react';
import {useColorModeValue} from 'native-base';

export const ThemeTextColor = () => {
	const bgColor = useColorModeValue('black' , 'gray.300');
	return bgColor;
};
