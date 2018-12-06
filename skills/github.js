const debug = require('debug')('message:github');

function gitHubAuth(controller) {
    // this should be converted to a slash command
    controller.on('slash_command', (bot, message) => {
        controller.storage.users.get(message.user, (err, user) => {
            if (err) {
                console.error(err);
                bot.replyInteractive(message, {
                    text: 'Something went wrong :(',
                    replace_original: false,
                    response_type: 'ephemeral',
                });
                return;
            }
            if (user.id && user.github_bearer) {
                controller.trigger('get_github_prs', [bot, message]);
            } else {
                controller.trigger('do_github_auth', [bot, message]);
            }
        });
    });

    controller.on('get_github_prs', (bot, message) => {
        // @todo add logic to make the GitHub request for PRs.
        bot.reply(message, 'Here are your PRS');
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
