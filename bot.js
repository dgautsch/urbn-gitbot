const fs = require('fs');
const env = require('node-env-file');

const envFile = `${__dirname}/.env`;

/* eslint-disable import/no-dynamic-require */
if (fs.existsSync(envFile)) {
    env(`${__dirname}/.env`);
}

function usageTip() {
    console.log('~~~~~~~~~~');
    console.log('Botkit Starter Kit');
    console.log('Execute your bot application like this:');
    console.log('clientId=<MY SLACK CLIENT ID> clientSecret=<MY CLIENT SECRET> PORT=3000 node bot.js');
    console.log('Get Slack app credentials here: https://api.slack.com/apps');
    console.log('~~~~~~~~~~');
}

if (!process.env.PORT) {
  usage_tip();
  process.exit(1);
}

const Botkit = require('botkit');

const botOptions = {
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
    clientSigningSecret: process.env.clientSigningSecret,
    scopes: ['bot'],
};

// Use a mongo database if specified, otherwise store in a JSON file local to the app.
// Mongo is automatically configured when deploying to Heroku
if (process.env.MONGO_URI) {
    const mongoStorage = require('botkit-storage-mongo')({ mongoUri: process.env.MONGO_URI });
    botOptions.storage = mongoStorage;
} else {
    botOptions.json_file_store = `${__dirname}/.data/db/`; // store user data in a simple JSON format
}

// Create the Botkit controller, which controls all instances of the bot.
const controller = Botkit.slackbot(botOptions);

controller.startTicking();

// Set up an Express-powered webserver to expose oauth and webhook endpoints
const webserver = require(`${__dirname}/components/express_webserver.js`)(controller);

if (process.env.clientId && process.env.clientSecret) {
    webserver.get('/', (req, res) => {
        res.render('index', {
            domain: req.get('host'),
            protocol: req.protocol,
            layout: 'layouts/default'
        });
    });

    // Set up a simple storage backend for keeping a record of customers
    // who sign up for the app via the oauth
    require(`${__dirname}/components/user_registration.js`)(controller);

    // Send an onboarding message when a new team joins
    require(`${__dirname}/components/onboarding.js`)(controller);

    const normalizedPath = require('path').join(__dirname, 'skills');

    // Require all skills
    require("fs").readdirSync(normalizedPath).forEach((file) => {
        require("./skills/" + file)(controller);
    });
} else {
    webserver.get('/', (req, res) => {
        res.send('clientId and clientSecret are required.');
    });
}
