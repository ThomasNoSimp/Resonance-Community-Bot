"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const repeatCommand = require('../commands/repeat');
module.exports = {
    name: 'messageCreate',
    execute(message) {
        if (message.author.bot)
            return;
        if (repeatCommand.shouldRepeat(message.channel.id)) {
            // Send the message content if it exists
            if (message.content) {
                message.channel.send(message.content);
            }
            // Send each attachment
            message.attachments.forEach(attachment => {
                message.channel.send({
                    files: [attachment]
                });
            });
        }
    },
};
