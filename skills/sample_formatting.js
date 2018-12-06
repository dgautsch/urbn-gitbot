/*

    List out various formatting options we'll be able to make use of in the URBN GitBot

*/

module.exports = (controller) => {
    controller.on('slash_command', (bot, message) => {
        // reply to slash command
        bot.replyInteractive(message, {
            text: 'Can you keep a secret?',
            replace_original: false,
            response_type: 'ephemeral',
        }, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Experiment finished');
            }
        });

        // bot.replyPublic(message,'Everyone can see this.');
        // bot.replyPrivate(message,'Only the person who used the slash command can see this.');
    });
};
