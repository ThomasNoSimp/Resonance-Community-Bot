import { Message, GuildMember } from 'discord.js';

module.exports = {
    name: 'blockedPings',
    description: 'Block the certain pings.',

    async execute(message: Message) {
        if (message.author.bot) return;

        const SinUserID = '996740835318186054'

        if (message.mentions.users.has(SinUserID)) {
            const member = message.member;

            if (member) {
                try {
                    await member.timeout(10 * 60 * 1000, 'Pinged Sin.');
                    message.channel.send(`${member.user.tag} has been muted for pinging Sin.`);
                } catch (error) {
                    console.error('Failed to mute the member:', error);
                    message.channel.send(`Failed to mute the member: ${error}`);
                }
            }
        }
    }
}
