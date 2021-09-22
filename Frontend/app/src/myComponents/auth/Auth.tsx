import React from "react";
import {Layout} from "../../components/Layout";
import ScrollViewWithGradient from "../ScrollViewWithGradient";
import {Login} from "./Login";
import {Box, Text} from "native-base";

export default class Auth extends React.Component<any, any>{

	constructor(props) {
		super(props);
		console.log("PROPS");
		console.log(props);
		const params = props.route.params;
		this.state = {
			params: params
		}
	}

	render() {
		return(
			<Layout title={"SSO für Stud.IP Uni-Osnabrück"}>
				<ScrollViewWithGradient>
					<Login params={this.state.params}/>
				</ScrollViewWithGradient>
			</Layout>
		)
	}
}