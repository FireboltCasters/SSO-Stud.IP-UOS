import React from "react";
import {Box, Button, Icon, Input, Text, useColorModeValue, View} from "native-base";
import App from "../../../App";
import axios from "axios";
import {Link} from "@react-navigation/native";
import {MaterialIcons} from "@expo/vector-icons";

export default class Login extends React.Component<any, any>{

	constructor(props) {
		super(props);
		this.state={
			params: this.props.params,
			authParams: {},
			showPasswordParamKeys: {}
		}
	}

	async fetchAuthParams(){
		try{
			let answer = await axios.get("http://localhost:3010/studip/authParams");
			let data = answer.data.params;
			this.setState({
				authParams: data
			})
		} catch (e){

		}
	}

	async componentDidMount() {
		await this.fetchAuthParams();
	}

	capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	toggleShowParamKeyInput(paramKey){
		let showPasswordParamKeys = this.state.showPasswordParamKeys;
		showPasswordParamKeys[paramKey] = !showPasswordParamKeys[paramKey]
		this.setState({
			showPasswordParamKeys: showPasswordParamKeys
		})
	}

	renderAuthParamForm(paramKey, paramType){
		let icon: string = "person";
		let rightElement = null;
		let show = this.state.showPasswordParamKeys[paramKey]

		if(paramType==="password"){
			icon = "lock";
			rightElement = (
				<Button roundedLeft="0" onPress={() => {this.toggleShowParamKeyInput(paramKey)}}>
					{show ? "Hide" : "Show"}
				</Button>
			)
		}

		let paramKeyAsName = this.capitalizeFirstLetter(paramKey);
		

		return <Box w="100%">
			<Input
				InputLeftElement={
					<Icon
						as={<MaterialIcons name={icon} />}
						size="md"
						m={2}
						color={'gray.300'}
					/>
				}
				placeholder={paramKeyAsName}
				// mx={4}
				placeholderTextColor={'blueGray.50'}
				InputRightElement={rightElement}
				type={show ? "text" : "password"}
			/>
		</Box>;
	}

	renderLoginForm(){
		let paramForms = [];

		let authParams = this.state.authParams
		console.log("authParams: ", authParams);
		let authParamKeys = Object.keys(authParams);
		for(let paramKey of authParamKeys){
			console.log("ParamKey: "+paramKey);
			let paramType = authParams[paramKey];
			paramForms.push(this.renderAuthParamForm(paramKey, paramType));
		}

		return (
			paramForms
		)
	}

	render() {
		return(
			<View>
				<View style={{height: 200}} />
				<Text>Login</Text>
				<Link to="/">
					Go To Home
				</Link>
				{this.renderLoginForm()}
			</View>
		)
	}
}