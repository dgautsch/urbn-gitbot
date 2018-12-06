const debug = require('debug')('github-authentication:debug');
const error = require('debug')('github-authentication:error');
const axios = require('axios');
const getPR = require('../github-pr');

getPR('dgautsch', 'urbn-gitbot').then(res => console.log(res));

function githubAuth(webserver, controller) {
    debug('Configured /github/auth url');
    webserver.get('/github/auth', (req, res) => {
        debug('entered on /github/auth');
        const {
            code,
            accessToken,
            tokenType,
        } = req.query;

        if (code) {
            debug('Bot Code: ', code);
            // add OAuth code to db
            axios.post('https://github.com/login/oauth/access_token'
        + `?client_id=${process.env.GITHUB_CLIENT_ID}`
        + `&client_secret=${process.env.GITHUB_CLIENT_SECRET}`
        + `&code=${code}`
        + `&state=${process.env.GITHUB_STATE_TOKEN}`
        + `&redirect_uri=${process.env.GITHUB_REDIRECT_URI}`)
                .then(result => {
                    let splitResults = result.data.split("&");
                    const token = splitResults[0].split('=')[1];
                    console.log(splitResults)

                    return 
                })
        } else if (accessToken && tokenType) {
            debug(accessToken, tokenType);
        } else {
            error('response with no code');
        }

        res.redirect('/');
    });

    webserver.get('/github', (req, res) => {
        
        axios.post(`https://api.github.com/app/installations/21940/access_tokens`, 
                        { headers: {
                                'Authorization': `Bearer ${JWT}`,
                                "Accept": "application/vnd.github.machine-man-preview+json"
                            },
                        }
                    )
                    .then(result => result.data.forEach(e => {
                        console.log(e.name)
                        if (e.name == 'MonoWeb') {
                            console.log(e)
                        }
                    }))
                    .catch(err => console.log(err))
        debug('entered on /github');
        return res.redirect('https://github.com/login/oauth/authorize'
                            + '?scope=user:email,read:user,read:org,repo:status'
                            + `&client_id=${process.env.GITHUB_CLIENT_ID}`
                            + `&state=${process.env.GITHUB_STATE_TOKEN}`);
    });
}

module.exports = githubAuth;
