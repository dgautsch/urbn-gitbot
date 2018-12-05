var debug = require('debug')('botkit:incoming_webhooks');
var axios = require('axios')

const state = "fndsjgbfhusdabic457438hfb89b0qbd80n9u2n4qf80dxrwb0t"

module.exports = function(webserver, controller) {

    debug('Configured /github/auth url');
    webserver.get('/github/auth', (req, res) => {
        console.log('entered on /github/auth')
        let code = req.query.code
        let access_token = req.query.access_token
        let token_type = req.query.token_type
        if (code) {
            console.log(code)
            // add OAuth code to db
            // axios.post('https://github.com/login/oauth/access_token', {
            //     client_id: `${process.env.GITHUB_CLIENT_ID}`,
            //     client_secret: `${process.env.GITHUB_CLIENT_ID}`,
            //     code: `${code}`,
            //     redirect_uri: 'http://localhost:3000/github/auth',
            //     state: state
            // })
            axios.post(`https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${code}&state=${state}&redirect_uri=http://localhost:3000/github/auth`)
            .then(result => {
                console.log(result.data.split('&').forEach(e => {
                    console.log(e.split('='))
                }))
            })

        } else if (access_token && token_type) {
            console.log(access_token, token_type)
        } else {
            console.log("resonse with no code")
        }

        // res.redirect('/')
    })
    
    webserver.get('/github', (req, res) => {
        console.log('entered on /github')
        return res.redirect(`https://github.com/login/oauth/authorize?scope=user:email,read:user,read:org&client_id=${process.env.GITHUB_CLIENT_ID}&state=${state}`)
    })

}