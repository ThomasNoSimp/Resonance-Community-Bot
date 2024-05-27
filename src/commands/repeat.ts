import { Message, PermissionsBitField } from 'discord.js';

let repeatMode = false;

module.exports = {
    name: 'repeat',
    description: 'Toggle repeat mode. When enabled, the bot will repeat every message sent by members.',
    execute(message: Message) {
        if (!message.member?.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('You do not have permission to use this command.');
        }

        repeatMode = !repeatMode;
        message.channel.send(`Repeat mode is now ${repeatMode ? 'enabled' : 'disabled'}.`);
    },
    shouldRepeat: () => repeatMode
};
