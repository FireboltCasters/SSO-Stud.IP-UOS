import {Connector, UrlHelper} from "studip-api";

const path = require('path') // has path and __dirname
const express = require('express')
const oauthServer = require('../oauth/server.js')

const DebugControl = require('../utilities/debug.js')

const AUTH_METHOD = async (username, password, scope) => {
  const domain = UrlHelper.STUDIP_DOMAIN_UNI_OSNABRUECK;

  try {
    const client = await Connector.getClient(domain, username, password);
    const user = client.getUser();
    // OpenID Idea
    /**
    user.profile = {
      name: user.name.formatted,
      family_name: user.name.family,
      given_name: user.name.given,
      middle_name: "",
      nickname: user.username,
      picture: user.avatar_medium,
      updated_at: ""
    }
    user.first_name = user.name.given;
    */
    let filteredUser = {};
    let scopeKeys = scope.split(" ");
    for(let scopeValue of scopeKeys){
        filteredUser[scopeValue] = user[scopeValue];
    }

    return filteredUser;
  } catch (err) {
    console.log('Authentification: error');
    console.log(err);
    throw new Error('Credentails incorrect');
  }
};


const router = express.Router() // Instantiate a new router

router.get('/authParams', (req,res) => {  // send back a simple form for the oauth
  res.status(200);
  res.json({"username":"string","password":"password"});
})

router.get('/', (req,res) => {  // send back a simple form for the oauth
  let urlAdaption = "";
  let query = req.query;
  let keys = Object.keys(query);
  for(let key of keys){
    urlAdaption+=key+"="+query[key]+"&";
  }
  let FRONTEND_URL = process.env.FRONTEND_URL;
  res.redirect(FRONTEND_URL+"/login"+"?"+urlAdaption);
})

router.post('/authorize', async (req,res,next) => {
  DebugControl.log.flow('Initial User Authentication')
  let FRONTEND_URL = process.env.FRONTEND_URL;
  const params = [ // Send params back down
    'client_id',
    'redirect_uri',
    'response_type',
    'grant_type',
    'state',
    'scope',
  ]
      .map(a => `${a}=${req.body[a]}`)
      .join('&')

  let {username, password, scope} = req.body;
  scope = scope || "";

  try{
    let user = await AUTH_METHOD(username, password, scope);
    req.body.user = user;
    return next()
  } catch (err){
    console.log(err);
  }

  return res.redirect(FRONTEND_URL+`/login?success=false&${params}`)

}, (req,res, next) => { // sends us to our redirect with an authorization code in our url
  DebugControl.log.flow('Authorization')
  return next()
}, oauthServer.authorize({
  authenticateHandler: {
    handle: req => {
      DebugControl.log.functionName('Authenticate Handler')
      DebugControl.log.parameters(Object.keys(req.body).map(k => ({name: k, value: req.body[k]})))
      return req.body.user
    }
  }
}))

router.post('/token', (req,res,next) => {
  DebugControl.log.flow('Token')
  next()
},oauthServer.token({
  requireClientAuthentication: { // whether client needs to provide client_secret
    // 'authorization_code': false,
  },
}))  // Sends back token


module.exports = router
