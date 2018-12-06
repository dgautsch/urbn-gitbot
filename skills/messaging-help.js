/**
 * When the bot joins a channel, tell everyone what it can do
 */
const config = require('../config');

const helpMessage = `I'm here to help you find out what PRs you currently have open and which of them need your attention. In order to get the most out of me, you can use the following slash commands:

* \`/${config.UGB_SLASH_COMMAND} pr\` - Pull all PRs
* \`/${config.UGB_SLASH_COMMAND} pr reviewer\` - Pull PRs where you are a reviewer
* \`/${config.UGB_SLASH_COMMAND} pr assigned\` - Pull PRs where you are an assignee
* \`/${config.UGB_SLASH_COMMAND} help\` - Additional information
* \`/${config.UGB_SLASH_COMMAND} creators\` - The lovely folks who made me`;

module.exports = (controller) => {
    // Generic help messaging event

    controller.on('get_help_message', (bot, message, initialMessage) => {
        bot.reply(message, {
            ...(initialMessage ? {
                text: initialMessage,
            } : {}),
            attachments: [{
                title: `Beep, boop! I'm the ${config.UGB_BOT_NAME}!`,
                text: helpMessage,
                mrkdwn_in: [
                    'text',
                    'pretext',
                ],
            }],
        });

        // Acknowledge reply success
        bot.replyAcknowledge();
    });

    controller.on('get_help_message_ephemeral', (bot, message, initialMessage) => {
        bot.replyInteractive(message, {
            ...(initialMessage ? {
                text: initialMessage,
            } : {}),
            attachments: [{
                title: `Beep, boop! I'm the ${config.UGB_BOT_NAME}!`,
                text: helpMessage,
                mrkdwn_in: [
                    'text',
                    'pretext',
                ],
            }],
        });

        // Acknowledge reply success
        bot.replyAcknowledge();
    });

    // Bot joins a channel
    controller.on('bot_channel_join,bot_group_join', (bot, message) => {
        const initialMessage = `Thanks for inviting me, <@${message.inviter}>!`;
        controller.trigger('get_help_message', [bot, message, initialMessage]);
    });

    // Someone asks for help
    const helpStrings = [
        // Need to double escape the backslash because we're within single quotes
        '^what can you do\\??$',
        '^help$',
    ];

    controller.hears(helpStrings, 'direct_mention', (bot, message) => {
        // 1 in 5 chance to show our easter egg
        const showEasterEgg = Math.floor(Math.random() * 5 + 1) === 1;

        let text = helpMessage;

        if (showEasterEgg) {
            text = `${text}

Does that help? No? You could always try turning it off and then back on again.`;
        }

        const messageObj = {
            attachments: [{
                pretext: `Don't worry-- *${config.UGB_BOT_NAME}* to the rescue, <@${message.user}>!`,
                text,
                mrkdwn_in: [
                    'text',
                    'pretext',
                ],
                ...(showEasterEgg ? {
                    image_url: 'https://media.giphy.com/media/F7yLXA5fJ5sLC/giphy.gif',
                } : {}),
            }],
        };

        bot.reply(message, messageObj);

        // Acknowledge reply success
        bot.replyAcknowledge();
    });

    // Someone asks who created me

    const creatorsMessage = `I was created during the 2018 URBN Fall Hackathon in a join effort by the following humans:

*Allan Ashenfelter* - Manager
*Dan Gautsch* - Technical Lead UCC
*Michael Greenberg* - Software Engineer
*Sean Kennedy* - Senior Software Engineer
*Brandon Wolvin* - Technical Lead Account
*John Zlotek* - Co-op`;

    controller.on('get_creator_message', (bot, message, initialMessage) => {
        bot.reply(message, {
            ...(initialMessage ? {
                text: initialMessage,
            } : {}),
            attachments: [{
                title: 'Beep, boop! Here are the humans that created me!',
                text: creatorsMessage,
                mrkdwn_in: [
                    'text',
                    'pretext',
                ],
            }],
        });

        // Acknowledge reply success
        bot.replyAcknowledge();
    });

    controller.on('get_creator_message_ephemeral', (bot, message, initialMessage) => {
        bot.replyInteractive(message, {
            ...(initialMessage ? {
                text: initialMessage,
            } : {}),
            attachments: [{
                title: 'Beep, boop! Here are the humans that created me!',
                text: creatorsMessage,
                mrkdwn_in: [
                    'text',
                    'pretext',
                ],
            }],
        });

        // Acknowledge reply success
        bot.replyAcknowledge();
    });

    const creatorStrings = [
        // eslint-disable-next-line no-useless-escape
        '^who made you\??$',
        // eslint-disable-next-line no-useless-escape
        '^who created you\??$',
        '^creators$',
        '^humans$',
    ];

    controller.hears(creatorStrings, 'direct_mention', (bot, message) => {
        const initialMessage = `Thanks for asking, <@${message.user}>!`;
        controller.trigger('get_creator_message', [bot, message, initialMessage]);
    });
};
