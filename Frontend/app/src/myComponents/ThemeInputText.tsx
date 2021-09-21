import React from 'react';
import {Input} from 'native-base';
import {ThemeTextColor} from "./ThemeTextColor";

export const ThemeInputText = (props) => {

	return(
		<Input
			{...props}
			placeholderTextColor={ThemeTextColor()}
		>
			{props.children}
		</Input>
	)
};
