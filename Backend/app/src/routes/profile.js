const path = require('path') // has path and __dirname
const express = require('express')
const router = express.Router()

router.get('/*', (req,res) => {
    console.log("Profile");
    console.log(req.url);
    console.log(res.locals.oauth.token);
    console.log(Object.keys(res.locals.oauth.token));

    let profile = res.locals.oauth.token.user;

    return res
        .status(200)
        .json(profile);
})

module.exports = router
