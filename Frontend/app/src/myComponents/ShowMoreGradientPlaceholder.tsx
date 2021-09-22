import React from "react";
import {Box, Button, Icon, View} from "native-base";
import {Ionicons} from "@expo/vector-icons";

export default class ShowMoreGradientPlaceholder extends React.Component{

	render() {
		return (
			<View style={{opacity: 0}}>
					<Box style={{padding: "12px"}} >
						<Icon
							as={Ionicons}
							_dark={{ name: 'sunny', color: 'orange.400' }}
							_light={{ name: 'moon', color: 'blueGray.100' }}
							size="md"
						/>
						<Icon
							as={Ionicons}
							_dark={{ name: 'sunny', color: 'orange.400' }}
							_light={{ name: 'moon', color: 'blueGray.100' }}
							size="md"
						/>
					</Box>
			</View>
		)
	}

}