"use strict";
const { Message } = require('discord.js');
module.exports = {
    name: 'detectLinks',
    description: 'Detect and log any links posted by users in the server.',
    execute(message) {
        if (message.author.bot)
            return;
        // Regular expression to match URLs
        const urlRegex = /(https?:\/\/(?:www\.)?(?!discord\.gg\/)[\w\-\.\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=\%]+)/;
        // Check if the message contains a URL
        if (urlRegex.test(message.content)) {
            // Reply with a message
            message.reply('Link detected!');
        }
    },
};
