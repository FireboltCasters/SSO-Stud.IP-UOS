import React, {useEffect, useState} from "react";
import {
	Box,
	Button,
	Checkbox,
	CircleIcon,
	Icon,
	Input,
	Modal,
	Pressable, Skeleton,
	Text,
	useColorModeValue,
	View
} from "native-base";
import App from "../../../App";
import axios from "axios";
import {Link} from "@react-navigation/native";
import {MaterialIcons} from "@expo/vector-icons";
import {ThemeInputText} from "../ThemeInputText";
import UniColors from "../UniColors";

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

export const Login = (props) => {

	const [authParams, setAuthParams] = useState({})
	const [showPasswordParamKeys, setShowPasswordParamKeys] = useState({})
	const [loginInProgress, setLoginInProgress] = useState(false)
	const [inputvalues, setInputvalues] = React.useState({});
	const [reloadNumber, setReloadNumber] = React.useState(0);
	const [checkboxValue, setCheckboxValue] = React.useState(false);
	const [showScope, setShowScope] = React.useState(false);

	const params = props.params || {};

	function getBackendURL(){
		let BACKEND_URL = process.env.APP_MANIFEST.extra.BACKEND_URL;
		return BACKEND_URL;
	}

	async function fetchAuthParams(){
		try{
			let answer = await axios.get(getBackendURL()+"/studip/authParams");
			let data = answer.data.params;
			setAuthParams(data);
		} catch (e){

		}
	}

	function toggleShowParamKeyInput(nextValue, paramKey){
		let currentValue = showPasswordParamKeys[paramKey];
		showPasswordParamKeys[paramKey] = !showPasswordParamKeys[paramKey]
		setShowPasswordParamKeys(showPasswordParamKeys)
		setReloadNumber(reloadNumber+1);
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
		let nativeId = "uos_username";

		if(paramType==="password"){
			show = showPasswordParamKeys[paramKey]; // before rendering the button

			icon = "lock";
			const bgColor = useColorModeValue(UniColors.UNI_ROT, UniColors.UNI_ROT);
			const textColor = useColorModeValue("white", "white");
			rightElement = (
				<Button key={"ButtonForInputForKey:"+paramKey+reloadNumber} _text={{ color: textColor }} style={{backgroundColor: bgColor}} roundedLeft="0" onPress={() => {toggleShowParamKeyInput(!show, paramKey)}}>
					{show ? "Verstecken" : "Zeigen"}
				</Button>
			)
			nativeId = "uos_password";
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
				nativeID={nativeId}
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
		try{
			let postData = getInputData();
			let url = getBackendURL()+"/studip/login";
			url+="?";
			let paramKeys = Object.keys(params);
			for(let paramKey of paramKeys){
				let paramValue = params[paramKey];
				url+=paramKey+"="+paramValue+"&"
			}
			if(url.endsWith("&")){
				url = url.substring(0, url.length - 1);
			}

			let answer = await axios.post(url, postData);
			let data = answer.data;
			let redirectURL = data.redirectURL;
            window.location.href = redirectURL;
			//useHistory(redirectURL);
		} catch (e){
			console.log(e);
		}
		setLoginInProgress(false);
	}

	function renderLoginButton(paramsLoaded){
		const bgColor = useColorModeValue(UniColors.UNI_ROT, UniColors.UNI_ROT);
		const textColor = useColorModeValue("white", "white");
		const diabled = !checkboxValue || !paramsLoaded;

		return <Box w="100%">
			<Button
				isDisabled={diabled}
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
				<Box style={{flexDirection: "row", backgroundColor: UniColors.MYUOS_GELB, width: "7px"}}>
					<Text fontSize="4xl" style={{fontWeight: "bold", color: "transparent"}}>|</Text>
				</Box>
					<Text fontSize="3xl" style={{fontWeight: "bold", paddingLeft: "30px"}}>Anmelden</Text>
			</Box>
		)
	}

	function renderHelptext(){
		const linkToUserName = "http://service.virtuos.uni-osnabrueck.de/faq/index.php/TechnikComputer/Passw%C3%B6rter";
		return (
			<Text>Geben Sie Ihren <Link to={linkToUserName}><Text style={{color: UniColors.UNI_ROT, fontWeight: "bold"}}>> Benutzernamen</Text></Link> und Ihr Passwort ein, um sich anzumelden:</Text>
		)
	}

	function renderAdditionalInfo(){
		const marker = <CircleIcon size={2} />;
		return(
			<Box style={{borderRadius: "0.25rem", backgroundColor: "#cfcfcf", padding: "0.5rem", paddingLeft: "2.5rem"}}>
				<Text style={{lineHeight: "24px"}}>{marker} Anmeldung mit dem Rechenzentrums-Login</Text>
				<Text style={{lineHeight: "24px"}}>{marker} Du wirst über das Uni-LDAP authentifiziert</Text>
				<Text style={{lineHeight: "24px"}}>{marker} Dein Passwort wird verschlüsselt übertragen und zu keiner Zeit gespeichert</Text>
			</Box>
		)
	}

	function renderConfirmBox(){
		return(
			<Pressable
				onPress={() => {setCheckboxValue(!checkboxValue)}}
			>
			<Box style={{flexDirection: "row", marginBottom: "20px"}}>
				<Checkbox isChecked={checkboxValue} colorScheme="danger" style={{marginRight: "20px"}}>
				</Checkbox>
				<Text>Mit der Anmeldung erkläre ich mit damit einverstanden, dass die <Text onPress={() => {setShowScope(true)}} style={{color: UniColors.UNI_ROT, fontWeight: "bold"}}>> personenbezogenen Daten</Text> von der Anwendung verwendet und gespeichert werden dürfen.</Text>
			</Box>
			</Pressable>
		);
	}

	function renderScope(){
		const scope = params.scope || "";
		const marker = <CircleIcon size={2} />;
		const renderedScopes = [];
		let splittedScopes = scope.split(" ");
		for(let scopeValue of splittedScopes){
			const scopeName = capitalizeFirstLetter(scopeValue);
			renderedScopes.push(<Text style={{lineHeight: "24px"}}>{marker} {scopeName}</Text>);
		}

		return(
		<Modal isOpen={showScope} onClose={() => setShowScope(false)}>
			<Modal.Content maxWidth="400px">
				<Modal.CloseButton />
				<Modal.Header>Personenbezogene Daten</Modal.Header>
				<Modal.Body>
					<Text style={{lineHeight: "24px"}}>Die Anwendung erhält zugriff auf folgende personenbezogene Daten:</Text>
					{renderedScopes}
				</Modal.Body>
			</Modal.Content>
		</Modal>
		);
	}

	function renderSpinner(){

	}

	function renderLoginForm(){
		let paramForms = [];

		let renderedParamInputForms = [];
		let authParamKeys = Object.keys(authParams);

		let paramsLoaded = authParamKeys.length!==0;
		if(!paramsLoaded){
			paramForms.push(<Skeleton variant="text" height={20} />)
			paramForms.push(<Skeleton variant="text" height={20} />)
		} else {
			for(let paramKey of authParamKeys){
				let paramType = authParams[paramKey];
				renderedParamInputForms.push(renderAuthParamForm(paramKey, paramType))
			}
		}

		for(let element of renderedParamInputForms){
			paramForms.push(element)
			paramForms.push(<View style={{height: 10}} />)
		}

		if(paramForms.length>0){
			let bottomForm = [
				renderAdditionalInfo(),
				renderConfirmBox(),
				renderLoginButton(paramsLoaded)
			];

			for(let element of bottomForm){
				paramForms.push(<View style={{height: 30}} />)
				paramForms.push(element)
			}
		}

		return (
			paramForms
		)
	}

	// corresponding componentDidMount
	useEffect(() => {
		fetchAuthParams();
	}, [])

	return(
		<View {...props}>
			<View style={{height: 200}} />
			{renderLoginTitle()}
			{renderHelptext()}
			<View style={{height: 30}} />
			{renderLoginForm()}
			{renderScope()}
		</View>
	)
}