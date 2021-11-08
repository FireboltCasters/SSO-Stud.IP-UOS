const path = require('path') // has path and __dirname
const express = require('express')
const router = express.Router()

router.get('/*', (req,res) => {
    console.log("Profile");
    console.log(req.url);
    const profile = {
        "sub": 200,
        "name": "Nils B",
        "given_name": "Nils",
        "family_name": "Baumgartner",
        "login": "octocat",
        "email": "nilsbaumgartner@live.de",
        "user": {"email": "nilsbaumgartner.de"},
        "profile": "https://connect2id.com/products/server/docs/api/userinfo",
        "id": 200,
    }
    return res
        .status(200)
        .json(profile);
})

module.exports = router
