var debug = require('debug')('botkit:incoming_webhooks');
var axios = require('axios')

module.exports = function(webserver, controller) {

    debug('Configured /github/auth url');
    webserver.get('/github/auth', (req, res) => {
        let code = req.query.code
        if (code) {
            // add OAuth code to db

        } else {
            console.log("resonse with no code")
        }

        res.redirect('/')
    })
    
    webserver.get('/github', (req, res) => {
        return res.redirect(`https://github.com/login/oauth/authorize?scope=user:email,read:user,read:org&client_id=${GITHUB_CLIENT_ID}`)
    })

}