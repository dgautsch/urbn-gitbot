const debug = require('debug')('message:github');
const data = require('../fixtures/data');


function gitHubAuth(controller) {

    controller.on('get_github_prs', (bot, message) => {
        // @todo add logic to make the GitHub request for PRs.
        let openPrs = '';
        if (data) {
            data.forEach((pr) => {
                /* eslint-disable-next-line */
                const { title, url } = pr;
                /* eslint-disable-next-line */
                openPrs += `<${url}|${title}>, \n`;
            });
        }

        bot.reply(message, {
            attachments: [
                {
                    title: 'GitHub PRs',
                    pretext: 'Here are your PRs for review.',
                    text: openPrs,
                    mrkdwn_in: ['text', 'pretext'],
                },
            ],
        }, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Experiment finished');
            }
        });
    });

    controller.on('do_github_auth', (bot, message) => {
        bot.replyInteractive(message, {
            text: 'Authenticate with GitHub',
            replace_original: false,
            response_type: 'ephemeral',
        }, (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log('Saving User');
                // save the GitHub oAuth bearer token in the database
                controller.storage.users.save({
                    id: message.user,
                    team: message.team,
                    github_bearer: 'foo bar',
                },
                (error) => {
                    debug(error);
                });
            }
        });
    });
}

module.exports = gitHubAuth;
