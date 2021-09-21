import React, {useEffect, useState} from "react";
import {Box, Button, Icon, Input, Text, useColorModeValue, View} from "native-base";
import App from "../../../App";
import axios from "axios";
import {Link} from "@react-navigation/native";
import {MaterialIcons} from "@expo/vector-icons";
import {ThemeInputText} from "../ThemeInputText";

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

const UNI_ROT = "#AC0634";
const MYUOS_GELB = "#fbb900";

const BACKEND_URL = "http://192.168.178.35:3010"

export const Login = (props) => {

	const [authParams, setAuthParams] = useState({})
	const [showPasswordParamKeys, setShowPasswordParamKeys] = useState({})
	const [loginInProgress, setLoginInProgress] = useState(false)
	const [inputvalues, setInputvalues] = React.useState({});

	const params = props.params;

	async function fetchAuthParams(){
		try{
			let answer = await axios.get(BACKEND_URL+"/studip/authParams");
			let data = answer.data.params;
			setAuthParams(data);
		} catch (e){

		}
	}

	function toggleShowParamKeyInput(paramKey){
		showPasswordParamKeys[paramKey] = !showPasswordParamKeys[paramKey]
		setShowPasswordParamKeys(showPasswordParamKeys)
	}

	function handleChangeInputValue(paramKey, event){
		const value = event.target.value;
		inputvalues[paramKey] = value;
		setInputvalues(inputvalues);
	}

	function renderAuthParamForm(paramKey, paramType){
		let icon: string = "person";
		let rightElement = null;
		let show = true;

		if(paramType==="password"){
			icon = "lock";
			const bgColor = useColorModeValue(UNI_ROT, UNI_ROT);
			const textColor = useColorModeValue("white", "white");
			rightElement = (
				<Button _text={{ color: textColor }} style={{backgroundColor: bgColor}} roundedLeft="0" onPress={() => {toggleShowParamKeyInput(paramKey)}}>
					{show ? "Verstecken" : "Zeigen"}
				</Button>
			)
			show = showPasswordParamKeys[paramKey]
		}

		let paramKeyAsName = capitalizeFirstLetter(paramKey);


		return <Box w="100%">
			<ThemeInputText
				key={"ParamInputForKey:"+paramKey}
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
				value={inputvalues[paramKey]}
				onChange={handleChangeInputValue.bind(null, paramKey)}
				InputRightElement={rightElement}
				type={show ? "text" : "password"}
			/>
		</Box>;
	}

	function getInputData(){
		let keys = Object.keys(inputvalues);
		let data = {};
		for(let key of keys){
			let value = inputvalues[key];
			data[key] = value;
		}
		return data;
	}

	async function handleLogin(){
		//setLoginInProgress(true);
		console.log("Handle Login");
		try{
			let postData = getInputData();
			console.log(postData);
			let url = BACKEND_URL+"/studip/login";
			console.log(params);
			url+="?client_id="+params.client_id+"&redirect_uri="+params.redirect_uri+"&response_type="+params.response_type+"&state="+params.state+"&scope="+params.scope;
			console.log("Send AXIOS post to: "+url);
			let answer = await axios.post(url, postData);
			console.log(answer);
			let data = answer.data;
			let redirectURL = data.redirectURL;
            window.location.href = redirectURL;
			//useHistory(redirectURL);
		} catch (e){
			console.log(e);
		}
		setLoginInProgress(false);
	}

	function renderLoginButton(){
		const bgColor = useColorModeValue(UNI_ROT, UNI_ROT);
		const textColor = useColorModeValue("white", "white");

		return <Box w="100%">
			<Button
				isLoading={loginInProgress} isLoadingText="Bearbeiten"
				style={{backgroundColor: bgColor}}
				_text={{ color: textColor }}
				onPress={() => handleLogin()}>
				Anmelden
			</Button>
		</Box>;
	}

	function renderLoginTitle(){
		return (
			<Box style={{flexDirection: "row", marginBottom: "20px"}}>
				<Box style={{flexDirection: "row", backgroundColor: MYUOS_GELB, width: "7px"}}>
					<Text fontSize="4xl" style={{fontWeight: "bold", color: "transparent"}}>|</Text>
				</Box>
					<Text fontSize="3xl" style={{fontWeight: "bold", paddingLeft: "30px"}}>Anmelden</Text>
			</Box>
		)
	}

	function renderHelptext(){
		const linkToUserName = "http://service.virtuos.uni-osnabrueck.de/faq/index.php/TechnikComputer/Passw%C3%B6rter";
		return (
			<Text>Geben Sie Ihren <Link to={linkToUserName}><Text style={{color: UNI_ROT, fontWeight: "bold"}}>> Benutzernamen</Text></Link> und Ihr Passwort ein, um sich anzumelden:</Text>
		)
	}

	function renderLoginForm(){
		let paramForms = [];

		let authParamKeys = Object.keys(authParams);
		for(let paramKey of authParamKeys){
			let paramType = authParams[paramKey];
			paramForms.push(renderAuthParamForm(paramKey, paramType));
			paramForms.push(<View style={{height: 10}} />)
		}

		if(paramForms.length>0){
			paramForms.push(<View style={{height: 30}} />)
			paramForms.push(renderLoginButton())
		}

		return (
			paramForms
		)
	}

	// corresponding componentDidMount
	useEffect(() => {
		fetchAuthParams();
	}, [])

	console.log("Render");
	return(
		<View>
			<View style={{height: 200}} />
			{renderLoginTitle()}
			{renderHelptext()}
			<View style={{height: 30}} />
			{renderLoginForm()}
		</View>
	)
}