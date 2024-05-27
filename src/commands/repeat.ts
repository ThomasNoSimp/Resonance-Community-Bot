import { Message, PermissionsBitField, TextChannel } from 'discord.js';

let repeatMode = false;
let testModeChannel: string | null = null; // To store the ID of the test channel

module.exports = {
    name: 'repeat',
    description: 'Toggle repeat mode. When enabled, the bot will repeat every message sent by members.',
    execute(message: Message, args: string[]) {
        if (!message.member?.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('You do not have permission to use this command.');
        }

        if (args.includes('--test')) {
            if (testModeChannel === message.channel.id) {
                testModeChannel = null;
                message.channel.send('Test repeat mode is now disabled.');
            } else {
                testModeChannel = message.channel.id;
                message.channel.send('Test repeat mode is now enabled in this channel.');
            }
        } else {
            repeatMode = !repeatMode;
            message.channel.send(`Repeat mode is now ${repeatMode ? 'enabled' : 'disabled'}.`);
        }
    },
    shouldRepeat: (channelId: string) => repeatMode || (testModeChannel === channelId)
};
