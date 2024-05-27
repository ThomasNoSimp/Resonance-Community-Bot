import { Client, Message, GuildMember, TextChannel } from 'discord.js';

const messageLimit = 5; // Number of messages
const timeLimit = 10000; // Time limit in milliseconds (10 seconds)
const warningsLimit = 3; // Number of warnings before muting
const joinLimit = 5; // Number of joins
const joinTimeLimit = 60000; // Time limit for joins in milliseconds (1 minute)

const userMessages = new Map<string, { count: number; timer: NodeJS.Timeout }>();
const userWarnings = new Map<string, number>();
const joinTimes = new Map<string, number[]>();

module.exports = {
    name: 'messageCreate',
    async execute(message: Message) {
        if (message.author.bot) return;

        const userId = message.author.id;

        // Check for message spam
        if (userMessages.has(userId)) {
            const userData = userMessages.get(userId)!;
            userData.count++;

            if (userData.count > messageLimit) {
                userWarnings.set(userId, (userWarnings.get(userId) || 0) + 1);
                userData.count = 0;
                clearTimeout(userData.timer);

                const warnings = userWarnings.get(userId)!;

                if (warnings >= warningsLimit) {
                    const muteRole = message.guild?.roles.cache.find(role => role.name === 'Muted');
                    const member = message.guild?.members.cache.get(userId);

                    if (muteRole && member) {
                        await member.roles.add(muteRole);
                        message.channel.send(`${message.author.tag} has been muted for spamming.`);
                    }
                } else {
                    message.channel.send(`${message.author.tag}, please stop spamming. Warning ${warnings}/${warningsLimit}`);
                }
            } else {
                userData.timer = setTimeout(() => userMessages.delete(userId), timeLimit);
            }
        } else {
            userMessages.set(userId, {
                count: 1,
                timer: setTimeout(() => userMessages.delete(userId), timeLimit)
            });
        }
    }
};

module.exports.guildMemberAdd = {
    name: 'guildMemberAdd',
    async execute(member: GuildMember) {
        const now = Date.now();
        const guildId = member.guild.id;

        if (!joinTimes.has(guildId)) {
            joinTimes.set(guildId, []);
        }

        const guildJoinTimes = joinTimes.get(guildId)!;
        guildJoinTimes.push(now);

        // Clean up old join times
        const filteredJoinTimes = guildJoinTimes.filter(joinTime => now - joinTime < joinTimeLimit);
        joinTimes.set(guildId, filteredJoinTimes);

        if (filteredJoinTimes.length > joinLimit) {
            await member.kick('Raid protection: too many joins in a short period');
            console.log(`Kicked ${member.user.tag} for raid protection.`);

            const alertChannel = member.guild.channels.cache.find(channel => channel.name === 'mod-log') as TextChannel;
            if (alertChannel) {
                alertChannel.send(`Kicked ${member.user.tag} for raid protection.`);
            }
        }
    }
};
