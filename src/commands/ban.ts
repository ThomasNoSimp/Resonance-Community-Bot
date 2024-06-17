import { Message } from 'discord.js';

module.exports = {
    name: 'ban',
    description: 'Bans a user.',
    async execute(message: Message) {
        // Check if the message author is a bot
        if (message.author.bot) return;

        // Check if the message is sent in a guild
        if (!message.guild) {
            return message.reply('This command can only be used in a server.');
        }

        // Check if the message author has administrative permissions
        if (!message.member?.permissions.has('BanMembers')) {
            return message.reply('You do not have permission to ban members.');
        }

        // Get the mentioned user
        const userToBan = message.mentions.users.first();

        // Check if a user was mentioned
        if (!userToBan) {
            return message.reply('Please mention a user to ban.');
        }

        // Get the member object of the user to be banned
        const memberToBan = message.guild.members.cache.get(userToBan.id);

        // Check if the user is in the guild
        if (!memberToBan) {
            return message.reply('That user is not in this guild.');
        }

        // Ban the user
        try {
            await message.guild.members.ban(userToBan);
            message.reply(`Successfully banned ${userToBan.tag}.`);
        } catch (error) {
            console.error(error);
            message.reply('There was an error trying to ban that user.');
        }
    }
};
