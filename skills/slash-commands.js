/**
 * When the bot joins a channel, tell everyone what it can do
 */

 const moment = require('moment');

function getUserPrCollection() {
    const userPrs = require('../fixtures/data');
    return userPrs;
}

// It feels super weird to pass this up 3 levels but we needed some sort
// of organization here
function processPRList(bot, message) {
    const messageAttachments = [];
    const userPrCollection = getUserPrCollection();

    // Add each PR to a message attachment
    userPrCollection.forEach(pr => messageAttachments.push({
        title: pr.title,
        title_link: pr.html_url,
        text: `_Assigned to *${pr.assignee.login}*, last updated *${moment(pr.updated_at).format('MMMM Do YYYY')}* at *${moment(pr.updated_at).format('h:mm a')}*_`,
        mrkdwn_in: [
            'text',
        ],
    }));

    bot.reply(message, {
        text: `Here is a list of <@${message.user}>'s Pull Requests:`,
        attachments: messageAttachments,
    });

    // Acknowledge reply success
    bot.replyAcknowledge();
}

function processPRCommands(subcommand, bot, message) {
    switch (subcommand) {
    default:
    case 'list':
        processPRList(bot, message);
        break;
    }
}

module.exports = (controller) => {
    controller.on('slash_command', (bot, message) => {
        let initialMessage;
        const command = message.text.split(' ')[0] || 'pr';
        const subcommand = message.text.split(' ')[1] || 'list';

        switch (command) {
        /**
         * GitHub authentication logic
         */
        case 'auth':
        case 'authenticate':
            controller.storage.users.get(message.user, (err, user) => {
                if (err) {
                    console.error(err);
                    controller.trigger('do_github_auth', [bot, message]);
                } else if (user.id && user.github_bearer) {
                    controller.trigger('get_github_prs', [bot, message]);
                }
            });
            break;

        /**
         * GitHub authentication logic
         */
        case 'pr':
            processPRCommands(subcommand, bot, message);
            break;

        /**
         * GitBot help messaging
         */
        case 'help':
            controller.trigger('get_help_message_ephemeral', [bot, message]);
            break;

        /**
         * Show the creators
         */
        case 'creators':
        case 'team':
        case 'humans':
            controller.trigger('get_creator_message_ephemeral', [bot, message]);
            break;

        /**
         * Slash command not supported
         */
        default:
            initialMessage = `Whoops! You tried to use \`${command}\` and we don't support that command. Here's a short description of what I can do for you:`;
            controller.trigger('get_help_message_ephemeral', [bot, message, initialMessage]);
            break;
        }
    });
};
