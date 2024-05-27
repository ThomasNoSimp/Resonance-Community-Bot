"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const repeatCommand = require('../commands/repeat');
module.exports = {
    name: 'messageCreate',
    execute(message) {
        if (message.author.bot)
            return;
        if (repeatCommand.shouldRepeat()) {
            message.channel.send(message.content);
        }
    },
};
