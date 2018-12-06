# URBN GitBot

Sometimes it's tough to keep all the noise from [GitHub](https://www.github.com) straight within your inbox. Not anymore! The **URBN GitBot** is a custom [Slack](https://www.slack.com) bot that seamlessly integrates the two together. All the information you need is only a quick command away.

Do you have a need to list out PRs assigned to you? No problem!

What about receiving notifications when a new PR is assigned to you? You've got it!

For instance, the `/gitbot pr` shows you all open PRs that have you listed as a reviewer.

## Slack Commands

* `/gitbot auth|authenticate` - Login to GitHub
* `/gitbot pr` - Alias of `pr list`
* `/gitbot pr list` - Pull all open PRs
* `/gitbot pr reviewer` - Pull PRs where you are a reviewer
* `/gitbot pr assigned` - Pull PRs where you are an assignee
* `/gitbot creators|humans|team` - The lovely folks who made me
* `/gitbot help` - Additional information

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

# Port bot will run on
PORT=3000

### GitBot Customization
UGB_BOT_NAME=GitBot
# Must be updated in Slack, this is used in the help messaging only
UGB_SLASH_COMMAND=gitbot

# note: .env is a shell file so there can't be spaces around =
```

### Expose Localhost / Start Server

In order to run the bot locally, you need to provide a bot name. When the bot name is set a subdomain will be created for you on the localtunnel service. This exposed url will need to be added to the App Configuration within Slack.

*Note: Just remember to switch `botname` to a unique value!*

* Run `npm install`
* Run `UGB_BOT_NAME=botname npm run dev`

# BotKit Documentation
* [Botkit](./BotKit.md)
* [Botkit - Slack](./BotKit-Slack.md)
