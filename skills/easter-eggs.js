/**
 * When the bot hears a specific phrase, show an easter egg
 */

module.exports = (controller) => {

    // When someone asks what does the fox say, show a gif!

    const whatDoesTheFoxSayString = [
        // Need to double escape the backslash because we're within single quotes
        'what does the fox say\\??',
    ];

    controller.hears(whatDoesTheFoxSayString, 'direct_mention, ambient, mention', (bot, message) => {
        console.log('heard something!', message);

        bot.reply(message, {
            attachments: [{
                text: `What does the fox say?!`,
                image_url: 'https://media.giphy.com/media/jPRBtKha7rO6I/giphy.gif',
            }],
        });
    });

}
