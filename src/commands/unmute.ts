import { Message, PermissionsBitField } from 'discord.js';

module.exports = {
    name: 'unmute',
    description: 'Unmute a user.',
    async execute(message: Message, args: string[]) {
        if (!message.member?.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('You do not have permission to use this command.');
        }

        const mentionedUser = message.mentions.users.first();
        if (!mentionedUser) {
            return message.reply('Please mention a valid user to unmute.');
        }

        const guild = message.guild;
        if (!guild) return;

        const member = guild.members.cache.get(mentionedUser.id);
        if (!member) {
            return message.reply('User not found in this guild.');
        }

        try {
            await member.timeout(null, 'Unmuted by an administrator');
            message.channel.send(`${mentionedUser.tag} has been unmuted.`);
        } catch (error) {
            console.error(error);
            message.channel.send('An error occurred while unmuting the user.');
        }
    },
};
