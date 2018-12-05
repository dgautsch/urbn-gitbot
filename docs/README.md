# URBN GitBot

## Documentation
* [Botkit](./BotKit.md)
* [Botkit - Slack](./BotKit-Slack.md)

## Local Development

### Create .env File

Copy the following text in to a .env file in the root of the project. Make sure to replace the given .env values with your specific keys.

```
# Environment Config

# store your secrets and config variables in here
# only invited collaborators will be able to see your .env values
# reference these in your code with process.env.SECRET

# Slack Client ID
clientId=

# Slack Secret ID
clientSecret=

# Slack Signing Secret ID
clientSigningSecret=

PORT=3000
LEARNING_MODE=true

# note: .env is a shell file so there can't be spaces around =
```

### Expose Localhost / Start Server

In order to run the bot locally, you need to provide a bot name. When the bot name is set a subdomain will be created for you on the localtunnel service. This exposed url will need to be added to the App Configuration within Slack.

* Run `npm install`
* Run `GITBOT_NAME=botname npm run dev`
