import React from "react";
import { ScrollView } from 'react-native';
import ShowMoreGradientPlaceholder from "./ShowMoreGradientPlaceholder";
import {ShowMoreGradient} from "./ShowMoreGradient";

export default class ScrollViewWithGradient extends React.Component<any, any>{

	constructor(props) {
		super(props);
	}

	render() {
		return(
			<>
				<ScrollView
					style={this.props.style}
					contentContainerStyle={{ width: '100%' }}
					showsVerticalScrollIndicator={false}
				>
					{this.props.children}
					<ShowMoreGradientPlaceholder />
				</ScrollView>
				<ShowMoreGradient />
			</>
		)
	}
}