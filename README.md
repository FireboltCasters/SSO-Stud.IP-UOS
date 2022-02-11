# SSO-Stud.IP-UOS

Outsourcing the authentification can be done with an SSO service. This project simply allows you to offer such a service. This project by default authentificates Stud.IP users for the university of osnabrück. You can adopt it to fit your requirements/endpoint.

## Variables for this Tutorial
- HOST: https://se-services.informatik.uos.de
- DOMAIN_PATH: studip
- AUTH_STUDIP_URL: https://se-services.informatik.uos.de/studip/api

## Setup
- Have Docker installed (https://www.docker.com/)
- Have Server-Toplevel-Proxy installed and configured (https://github.com/FireboltCasters/Server-Toplevel-Proxy)
  - Otherwise you need to adapt the `docker-compose.yaml`, so that your proxy redirects it to this docker instance
- Edit `.env`
- Run `docker-compose up`

You can check if the routing is correct if you can reach `YOUR_HOST/DOMAIN_PATH/whoami`, then you should reach `YOUR_HOST/DOMAIN_PATH/app`

## Usage
We recommend the usage of Directus (https://directus.io/)

### Directus Usage:
The usage is very simple for directus, since it handles the SSO for us:
Just set for directus the environment variables. We use in this example the `docker-compose.yaml` (with the above used variables and addition the default role id as: `AUTH_STUDIP_DEFAULT_ROLE_ID`):

`docker-compose.yaml`:

      AUTH_PROVIDERS: "studip"

      AUTH_STUDIP_DRIVER: "oauth2"
      AUTH_STUDIP_CLIENT_ID: "${HOST}$$redirect=${DOMAIN_PRE}://${HOST}/${DOMAIN_PATH}/${BACKEND_PATH}/auth/login/studip/callback"
      #No Client secret needed
      AUTH_STUDIP_CLIENT_SECRET: "JustForDirectus"
      AUTH_STUDIP_AUTHORIZE_URL: "${AUTH_STUDIP_URL}/oauth"
      AUTH_STUDIP_ACCESS_URL: "${AUTH_STUDIP_URL}/oauth/token"
      AUTH_STUDIP_PROFILE_URL: "${AUTH_STUDIP_URL}/profile"
      AUTH_STUDIP_SCOPE: "email name user_id username perms avatar_normal"
      AUTH_STUDIP_ICON: "school"
      AUTH_STUDIP_IDENTIFIER_KEY: "username"
      AUTH_STUDIP_ALLOW_PUBLIC_REGISTRATION: "true"
      AUTH_STUDIP_DEFAULT_ROLE_ID: "${AUTH_STUDIP_DEFAULT_ROLE_ID}"

Thats it for directus



### Custom Implemtation

#### Variables:
- REDIRECT_URL: <YOUR_REDIRECT>
- CLIENT_ID: <YOUR_DOMAIN/redirect=<REDIRECT_URL>>
  - Example: example.de%24redirect%3Dhttps%3A%2F%example.de%myapp%2Fapi%2Fauth%2Flogin%2Fprovider%2Fcallback
- CODE_CHALLENGE: <YOUR_CHALLENGE>
- CODE_CHALLENGE_METHOD: S256
- RESPONSE_TYPE: code
- SCOPE: Your Scopes seperated by space (email name user_id username perms avatar_normal)
- STATE: <YOUR_STATE>
- HOST: <ADDRESS_OF_SSO_PROVIDER> (https://se-services.informatik.uos.de)
- DOMAIN_PATH: studip

#### Endpoints
- Profile: ${AUTH_STUDIP_URL}/profile
- Authorize URL: <AUTH_STUDIP_URL>/oauth
- Access URL: <AUTH_STUDIP_URL>/oauth/token
- <HOST>/<DOMAIN_PATH>/app/login?access_type=offline&client_id=<CLIENT_ID>&code_challenge=<CODE_CHALLENGE>&code_challenge_method=S256&redirect_uri=<REDIRECT_URI>&response_type=code&scope=<SCOPE>&state=<STATE>