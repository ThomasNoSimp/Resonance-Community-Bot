"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
let repeatMode = false;
let testModeChannel = null; // To store the ID of the test channel
module.exports = {
    name: 'repeat',
    description: 'Toggle repeat mode. When enabled, the bot will repeat every message sent by members.',
    execute(message, args) {
        var _a;
        if (!((_a = message.member) === null || _a === void 0 ? void 0 : _a.permissions.has(discord_js_1.PermissionsBitField.Flags.Administrator))) {
            return message.reply('You do not have permission to use this command.');
        }
        if (args.includes('--test')) {
            if (testModeChannel === message.channel.id) {
                testModeChannel = null;
                message.channel.send('Test repeat mode is now disabled.');
            }
            else {
                testModeChannel = message.channel.id;
                message.channel.send('Test repeat mode is now enabled in this channel.');
            }
        }
        else {
            repeatMode = !repeatMode;
            message.channel.send(`Repeat mode is now ${repeatMode ? 'enabled' : 'disabled'}.`);
        }
    },
    shouldRepeat: (channelId) => repeatMode || (testModeChannel === channelId)
};
