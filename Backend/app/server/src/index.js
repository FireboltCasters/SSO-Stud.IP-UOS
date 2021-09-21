/* istanbul ignore file */
import {SsoAuth2Server} from 'sso-oauth2-server';
import {Connector, UrlHelper} from 'studip-api';
import cors from "cors";

const STUDIP_AUTH_METHOD = async (body, client_id, scope, query) => {
  console.log('Authentification: start');
  const username = body.username;
  const password = body.password;

  const domain = UrlHelper.STUDIP_DOMAIN_UNI_OSNABRUECK;

  try {
    const client = await Connector.getClient(domain, username, password);
    const user = client.getUser();
    console.log('Authentification: success');
    console.log(user);
    return user;
  } catch (err) {
    console.log('Authentification: error');
    console.log(err);
    throw new Error('Credentails incorrect');
  }
};

const requiredLoginParams = {
  username: 'string',
  password: 'password',
};

const redirectMode = false;
const port = 3010;
const route = '/studip';
const sessionSecret = 'keyboard cat';
const jwtSecret = 'MySuperSecret';
const ssoServer = new SsoAuth2Server(
  redirectMode,
  port,
  route,
  sessionSecret,
  jwtSecret,
  STUDIP_AUTH_METHOD,
  requiredLoginParams
);

ssoServer.start();

