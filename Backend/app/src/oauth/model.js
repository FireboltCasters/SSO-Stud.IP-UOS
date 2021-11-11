// See https://oauth2-server.readthedocs.io/en/latest/model/spec.html for what you can do with this
const crypto = require('crypto')
const urlencode = require('urlencode');
const db = { // Here is a fast overview of what your db model should look like
  authorizationCode: {
    authorizationCode: '', // A string that contains the code
    expiresAt: new Date(), // A date when the code expires
    redirectUri: '', // A string of where to redirect to with this code
    client: null, // See the client section
    user: null, // Whatever you want... This is where you can be flexible with the protocol
  },
  client: { // Application wanting to authenticate with this server
    clientId: '', // Unique string representing the client
    clientSecret: '', // Secret of the client; Can be null
    grants: [], // Array of grants that the client can use (ie, `authorization_code`)
    redirectUris: [], // Array of urls the client is allowed to redirect to
  },
  token: {
    accessToken: '', // Access token that the server created
    accessTokenExpiresAt: new Date(), // Date the token expires
    client: null, // Client associated with this token
    user: null, // User associated with this token
  },
  //TODO do i need to save each token individual?
  tokens: {},
  clients: {},
  authorizationCodes: {}
}

const DebugControl = require('../utilities/debug.js')

module.exports = {
  getClient: function (clientId, clientSecret) {
    // query db for details with client

    // clientSecret may be null, because of authorization_code flow, https://www.oauth.com/oauth2-servers/single-page-apps/
    log({
      title: 'Get Client',
      parameters: [
        { name: 'clientId', value: clientId },
        { name: 'clientSecret', value: clientSecret },
      ]
    })

    let redirectUris = [];

    // Since wildcards are not allowed/implemented
    // https://github.com/oauthjs/node-oauth2-server/issues/229
    // we will make a small hack, to allow for ourself redirects
    const redirectSplit = "$redirect=";
    const urlParsedSplit = "%24redirect%3D";

    const redirectSplitEncoded = urlencode(redirectSplit, 'gbk')
    if(!!clientId && clientId.includes(redirectSplitEncoded)){
      clientId = urlencode.decode(clientId, 'gbk');
    }

    if(!!clientId && clientId.includes(redirectSplit)){ //check if our split word is found
      let splits = clientId.split(redirectSplit); //split there
      console.log(splits);
      let filteredMeantClientId = splits[0]; //get the meant secret
      clientId = filteredMeantClientId;
      let filteredMeantRedirectURL = splits[1]; //get the redirect url we want
      redirectUris = [filteredMeantRedirectURL];
    }

    let clientIdUppercase = clientId.toUpperCase();

    const ENV_CLIENT_START = "CLIENT_";
    if(redirectUris.length===0){
        let REDIRECT_URIS = process.env[ENV_CLIENT_START+clientIdUppercase+"_REDICRECT_URIS"] || "";
        redirectUris = REDIRECT_URIS.split(",");
    }

    let GRANTS = process.env[ENV_CLIENT_START+clientIdUppercase+"_GRANTS"] || "";
    let grants = GRANTS.split(",");
    let secret = process.env[ENV_CLIENT_START+clientIdUppercase+"_SECRET"] || "";

    db.client = { // Retrieved from the database
      clientId: clientId,
      clientSecret: secret,
      grants: grants,
      redirectUris: redirectUris ,
    }

    log({
      title: 'Get Client - Resulting Client',
      parameters: [
        { name: 'clientId:', value: db.client.clientId },
        { name: 'clientSecret', value: db.client.clientSecret },
	{ name: 'grants', value: db.client.grants },
	{ name: 'redirectUris', value: db.client.redirectUris },
      ]
    })

    return new Promise(resolve => {
      resolve(db.client)
    })
  },
  saveToken: (token, client, user) => {
    /* This is where you insert the token into the database */
    log({
      title: 'Save Token',
      parameters: [
        { name: 'token', value: token },
        { name: 'client', value: client },
        { name: 'user', value: user },
      ],
    })
    db.token = {
      accessToken: token.accessToken,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
      refreshToken: token.refreshToken, // NOTE this is only needed if you need refresh tokens down the line
      refreshTokenExpiresAt: token.refreshTokenExpiresAt,
      client: client,
      user: user,
    }
    return new Promise(resolve => resolve(db.token))

  },
  getAccessToken: token => {
    /* This is where you select the token from the database where the code matches */
    log({
      title: 'Get Access Token',
      parameters: [
        { name: 'token', value: token },
      ]
    })
    if (!token || token === 'undefined') return false
    return new Promise(resolve => resolve(db.token))
  },
  getRefreshToken: token => {
    /* Retrieves the token from the database */
    log({
      title: 'Get Refresh Token',
      parameters: [
        { name: 'token', value: token },
      ],
    })
    DebugControl.log.variable({ name: 'db.token', value: db.token })
    return new Promise(resolve => resolve(db.token))
  },
  revokeToken: token => {
    /* Delete the token from the database */
    log({
      title: 'Revoke Token',
      parameters: [
        { name: 'token', value: token },
      ]
    })
    if (!token || token === 'undefined') return false
    return new Promise(resolve => resolve(true))
  },
  saveAuthorizationCode: (code, client, user) => {
    /* This is where you store the access code data into the database */
    log({
      title: 'Save Authorization Code',
      parameters: [
        { name: 'code', value: code },
        { name: 'client', value: client },
        { name: 'user', value: user },
      ],
    })
    db.authorizationCode = {
      authorizationCode: code.authorizationCode,
      expiresAt: code.expiresAt,
      client: client,
      user: user,
    }
    return new Promise(resolve => resolve(Object.assign({
      redirectUri: `${code.redirectUri}`,
    }, db.authorizationCode)))
  },
  getAuthorizationCode: authorizationCode => {
    /* this is where we fetch the stored data from the code */
    log({
      title: 'Get Authorization code',
      parameters: [
        { name: 'authorizationCode', value: authorizationCode },
      ],
    })
    return new Promise(resolve => {
      resolve(db.authorizationCode)
    })
  },
  revokeAuthorizationCode: authorizationCode => {
    /* This is where we delete codes */
    log({
      title: 'Revoke Authorization Code',
      parameters: [
        { name: 'authorizationCode', value: authorizationCode },
      ],
    })
    db.authorizationCode = { // DB Delete in this in memory example :)
      authorizationCode: '', // A string that contains the code
      expiresAt: new Date(), // A date when the code expires
      redirectUri: '', // A string of where to redirect to with this code
      client: null, // See the client section
      user: null, // Whatever you want... This is where you can be flexible with the protocol
    }
    const codeWasFoundAndDeleted = true  // Return true if code found and deleted, false otherwise
    return new Promise(resolve => resolve(codeWasFoundAndDeleted))
  },
  verifyScope: (token, scope) => {
    /* This is where we check to make sure the client has access to this scope */
    log({
      title: 'Verify Scope',
      parameters: [
        { name: 'token', value: token },
        { name: 'scope', value: scope },
      ],
    })
    const userHasAccess = true  // return true if this user / client combo has access to this resource
    return new Promise(resolve => resolve(userHasAccess))
  }
}

function log({ title, parameters }) {
  DebugControl.log.functionName(title)
  DebugControl.log.parameters(parameters)
}
