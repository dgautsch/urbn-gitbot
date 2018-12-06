/**
 * When the bot joins a channel, tell everyone what it can do
 */

module.exports = (controller) => {

    controller.on('slash_command', (bot, message) => {

        const command = message.text.split(' ')[0] || 'pr';

        switch(command) {
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
                bot.reply(message, {
                    text: `You used the command ${command}`,
                });
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
                const initialMessage = `Whoops! You tried to use \`${command}\` and we don't support that command. Here's a short description of what I can do for you:`;
                controller.trigger('get_help_message_ephemeral', [bot, message, initialMessage]);
                break;
        }

    });

};
