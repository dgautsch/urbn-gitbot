const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const RSA = require('node-rsa');
const axios = require('axios');
const error = require('debug')('github-pr:error');

const cert = fs.readFileSync(path.resolve(__dirname, '../urbn-gitbot.2018-12-06.private-key.pem'));
const rsa = new RSA(cert);
const publicPem = rsa.exportKey('pkcs1-private-pem').toString();

function createHeader(token, type = 'Bearer') {
    return {
        headers: {
            Authorization: `${type} ${token}`,
            Accept: 'application/vnd.github.machine-man-preview+json',
        },
    };
}

module.exports = async function getPRsForRepo(owner, repo) {
    const JWT = jwt.sign({
        iss: 21940,
        iat: parseInt(Date.UTC(Date.now()), 10),
    }, publicPem, { expiresIn: '10m', algorithm: 'RS256' });

    const installations = (await axios.get('https://api.github.com/app/installations', createHeader(JWT))).data;

    const filteredList = installations.filter(e => e.account.login === owner);

    let tokenURL;

    if (filteredList.length !== 1) {
        error(filteredList);
        return [];
    }

    tokenURL = filteredList[0].access_tokens_url;
    tokenURL = tokenURL.replace('https://api.github.com/installations/', 'https://api.github.com/app/installations/');

    let apiToken;
    try {
        apiToken = (
            await axios.post(
                tokenURL,
                null,
                createHeader(JWT),
            )).data.token;
    } catch (e) {
        error(e);
        return [];
    }

    const res = (
        await axios.get(
            `https://api.github.com/repos/${owner}/${repo}/pulls`,
            createHeader(apiToken),
        )
    ).data;

    return res;
};
