import React, {Component} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Examples, MasonLayout } from '../screens';
import Auth from "../myComponents/auth/Auth";

const Stack = createStackNavigator();

const MASONLAYOUT_SCEENNAME = "Home";
const EXAMPLES_SCEENNAME = "Component | NativeBase";
const AUTH_SCREENNAME = "Auth";

export class RootStack extends Component{
	constructor(props) {
		super(props);
	}

	render() {
		return(
			<Stack.Navigator initialRouteName={AUTH_SCREENNAME} screenOptions={{
				headerShown: false,
			}}>
				<Stack.Screen
					name={EXAMPLES_SCEENNAME}
					component={Examples}
					options={{
						headerShown: false,
					}}
				/>
				<Stack.Screen
					name={MASONLAYOUT_SCEENNAME}
					component={MasonLayout}
				/>
				<Stack.Screen
					name={AUTH_SCREENNAME}
					component={Auth}
				/>
			</Stack.Navigator>
		)
	}
}
