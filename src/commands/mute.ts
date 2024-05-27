import { Message, PermissionsBitField, Role, GuildMember, TextChannel, VoiceChannel, NewsChannel, StageChannel, CategoryChannel } from 'discord.js';

module.exports = {
    name: 'mute',
    description: 'Mute a user.',
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

        let muteRole = guild.roles.cache.find(role => role.name === 'Muted');
        if (!muteRole) {
            try {
                muteRole = await guild.roles.create({
                    name: 'Muted',
                    permissions: [],
                });

                guild.channels.cache.forEach(async (channel) => {
                    if (
                        channel instanceof TextChannel || 
                        channel instanceof VoiceChannel || 
                        channel instanceof NewsChannel || 
                        channel instanceof StageChannel || 
                        channel instanceof CategoryChannel
                    ) {
                        await channel.permissionOverwrites.create(muteRole as Role, {
                            SendMessages: false,
                            AddReactions: false,
                            Speak: false,
                            Stream: false,
                        });
                    }
                });

                message.channel.send('Muted role has been created.');
            } catch (error) {
                console.error(error);
                return message.channel.send('An error occurred while creating the Muted role.');
            }
        }

        if (member.roles.cache.has(muteRole.id)) {
            return message.reply('This user is already muted.');
        }

        try {
            await member.roles.add(muteRole);
            message.channel.send(`${mentionedUser.tag} has been muted.`);
        } catch (error) {
            console.error(error);
            message.channel.send('An error occurred while muting the user.');
        }
    },
};
