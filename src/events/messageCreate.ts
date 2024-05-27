import { Message } from 'discord.js';
const repeatCommand = require('../commands/repeat');

module.exports = {
    name: 'messageCreate',
    execute(message: Message) {
        if (message.author.bot) return;

        if (repeatCommand.shouldRepeat()) {
            message.channel.send(message.content);
        }
    },
};
