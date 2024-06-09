import { Message, PermissionsBitField } from 'discord.js';

module.exports = {
    name: 'mute',
    description: 'Mute a user using the built-in timeout feature.',
    async execute(message: Message, args: string[]) {
        if (!message.member?.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('You do not have permission to use this command.');
        }

        const mentionedUser = message.mentions.users.first();
        if (!mentionedUser) {
            return message.reply('Please mention a valid user to mute.');
        }

        const guild = message.guild;
        if (!guild) return;

        const member = guild.members.cache.get(mentionedUser.id);
        if (!member) {
            return message.reply('User not found in this guild.');
        }

        if (args.length < 2) {
            return message.reply('Please provide a duration for the mute in minutes.');
        }

        const muteDuration = parseInt(args[1], 10);
        if (isNaN(muteDuration) || muteDuration <= 0) {
            return message.reply('Please provide a valid duration in minutes.');
        }

        const muteTimeout = muteDuration * 60 * 1000; // Convert minutes to milliseconds

        try {
            await member.timeout(muteTimeout, 'Muted by an administrator');
            message.channel.send(`${mentionedUser.tag} has been muted for ${muteDuration} minutes.`);
        } catch (error) {
            console.error(error);
            message.channel.send('An error occurred while muting the user.');
        }
    },
};
