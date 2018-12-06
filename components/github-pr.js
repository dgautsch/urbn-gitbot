const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const RSA = require('node-rsa');
const axios = require('axios');

const cert = fs.readFileSync(path.resolve(__dirname, '../urbn-gitbot.2018-12-06.private-key.pem'));
const rsa = new RSA(cert);
const publicPem = rsa.exportKey('pkcs1-private-pem').toString();

function createHeader(token) {
    return {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.machine-man-preview+json',
        },
    };
}

module.exports = async function getPRsForRepo(user, repo) {
    const JWT = jwt.sign({
        iss: 21940,
        iat: parseInt(Date.UTC(Date.now()), 10),
    }, publicPem, { expiresIn: '10m', algorithm: 'RS256' });

    const installations = (await axios.get('https://api.github.com/app/installations', createHeader(JWT))).data

    const filteredList = installations.filter(e => e.account.login === user);

    let tokenURL;

    if (filteredList.length === 1) {
        tokenURL = filteredList[0].access_tokens_url;
        tokenURL = tokenURL.replace('https://api.github.com/installations/', 'https://api.github.com/app/installations/');
    } else {
        return [];
    }

    let apiToken;
    try {
        apiToken = (
            await axios.post(
                tokenURL,
                null,
                createHeader(JWT),
            )).data.token;
    } catch (error) {
        return [];
    }

    const res = (
        await axios.get(
            `https://api.github.com/repos/${user}/${repo}/pulls`,
            createHeader(apiToken),
        )
    ).data;

    return res;
};
