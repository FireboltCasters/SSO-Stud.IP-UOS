import React from "react";
import {Button, Icon, View} from "native-base";
import {Ionicons} from "@expo/vector-icons";

export default class ShowMoreGradientPlaceholder extends React.Component{

	render() {
		return (
			<View style={{opacity: 0}}>
					<Button >
						<Icon
							as={Ionicons}
							_dark={{ name: 'sunny', color: 'orange.400' }}
							_light={{ name: 'moon', color: 'blueGray.100' }}
							size="md"
						/>
					</Button>
			</View>
		)
	}

}