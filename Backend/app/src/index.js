/* istanbul ignore file */
import {SsoAuth2Server} from 'sso-oauth2-server';
import {Connector, UrlHelper} from 'studip-api';
import cors from 'cors';

const usernameLabel = "RZ-Kennung";
const passwordLabel = "RZ-Password";

const requiredLoginParams = {
  [usernameLabel]: 'string',
  [passwordLabel]: 'password',
};

const allowCrossDomain = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.send(200);
  } else {
    next();
  }
}

const STUDIP_AUTH_METHOD = async (body, client_id, scope, query) => {
  const username = body[usernameLabel];
  const password = body[passwordLabel];

  const domain = UrlHelper.STUDIP_DOMAIN_UNI_OSNABRUECK;

  try {
    const client = await Connector.getClient(domain, username, password);
    const user = client.getUser();
    return user;
  } catch (err) {
    console.log('Authentification: error');
    console.log(err);
    throw new Error('Credentails incorrect');
  }
};

const express = require('express')

const app = express()
app.use(cors());
app.use(allowCrossDomain.bind(null));
const port = 3010
const bodyParser = require('body-parser')
const oauthServer = require('./oauth/server.js')

const DebugControl = require('./utilities/debug.js')

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(DebugControl.log.request())

app.use('/profile', oauthServer.authenticate(), require('./routes/profile.js')) // routes to access the protected stuff
app.use('/oauth', require('./routes/auth.js')) // routes to access the auth stuff
// Note that the next router uses middleware. That protects all routes within this middleware

app.listen(port)
console.log("Oauth Server listening on port ", port)

module.exports = app // For testing
