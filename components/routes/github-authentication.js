var axios = require('axios')
let debug = require('debug')('botkit:main')
const octokit = require('@octokit/rest')


module.exports = function(webserver, controller) {

    debug('Configured /github/auth url');
    webserver.get('/github/auth', (req, res) => {
        debug('entered on /github/auth')
        let { code, access_token, token_type } = req.query

        if (code) {
            debug('Bot Code: ', code);
                        // add OAuth code to db
            axios.post(`https://github.com/login/oauth/access_token` +
                        `?client_id=${process.env.GITHUB_CLIENT_ID}` +
                        `&client_secret=${process.env.GITHUB_CLIENT_SECRET}` +
                        `&code=${code}` +
                        `&state=${process.env.GITHUB_STATE_TOKEN}` +
                        `&redirect_uri=${process.env.GITHUB_REDIRECT_URI}`
            )

            .then(result => {
                debug(result.data)
                result.data.split('&').forEach(e => {
                    debug(e.split('='))
                })

            }).catch(err => debug(err))


        } else if (access_token && token_type) {
            debug(access_token, token_type)
        } else {
            debug("response with no code")
        }
        
        res.redirect('/')
    })
    
    webserver.get('/github', (req, res) => {
        debug('entered on /github')
        return res.redirect(`https://github.com/login/oauth/authorize` +
            `?scope=user:email,read:user,read:org` +
            `&client_id=${process.env.GITHUB_CLIENT_ID}` +
            `&state=${process.env.GITHUB_STATE_TOKEN}`
        )
    })

}