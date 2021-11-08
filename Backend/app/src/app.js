const express = require('express')

const app = express()
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
