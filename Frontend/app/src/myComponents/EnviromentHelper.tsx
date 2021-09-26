export default class EnviromentHelper{

	static getAppManifest(): any{
		return process.env.APP_MANIFEST;
	}

	static getCustomEnvVariables(): any{
		return EnviromentHelper.getAppManifest().extra;
	}

	static getBackendURL(){
		return EnviromentHelper.getCustomEnvVariables().BACKEND_URL;
	}

	static getBasePath(){
		return EnviromentHelper.getCustomEnvVariables().BASE_PATH;
	}

}