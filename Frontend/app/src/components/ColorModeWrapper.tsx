import React from "react";

export default class ColorModeWrapper extends React.Component<any, any>{

	static ColorMode = undefined;

	constructor(props) {
		super(props);
		ColorModeWrapper.ColorMode = this.props.colorMode;
	}

	render() {
		return(
			this.props.children
		)
	}
}