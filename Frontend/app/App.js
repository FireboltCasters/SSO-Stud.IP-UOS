import React from 'react';
import { NativeBaseProvider } from 'native-base';
import nativebaseConfig from './nativebase.config';
import config from "./config.json";
import { Root } from './src/components/RootComponent';
import ColorCodeManager from "./src/theme/ColorCodeManager";
import BaseThemeGenerator from "./src/theme";
import {RootStack} from "./src/navigators/rootNavigator";
import {ColorStatusBar} from "./src/myComponents/ColorStatusBar";
import {useColorMode} from "native-base/src/core/color-mode/hooks";

export default class App extends React.Component{

	constructor(props) {
		super(props);
	}

	getBaseTheme(){
		let initialColorMode = this.props.initialColorMode || ColorCodeManager.VALUE_THEME_LIGHT;
		return BaseThemeGenerator.getBaseTheme(initialColorMode);
	}

	render() {
		const theme = this.getBaseTheme();
		let content = <RootStack />
		if(!!this.props.children){
			content = this.props.children;
		}

		return (
			<NativeBaseProvider theme={theme} colorModeManager={ColorCodeManager.getManager()} config={nativebaseConfig}>
				<Root>{content}</Root>
				<ColorStatusBar />
			</NativeBaseProvider>
		);
	}
}
