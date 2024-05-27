"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const messageLimit = 5; // Number of messages
const timeLimit = 10000; // Time limit in milliseconds (10 seconds)
const warningsLimit = 3; // Number of warnings before muting
const joinLimit = 5; // Number of joins
const joinTimeLimit = 60000; // Time limit for joins in milliseconds (1 minute)
const userMessages = new Map();
const userWarnings = new Map();
const joinTimes = new Map();
module.exports = {
    name: 'messageCreate',
    execute(message) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (message.author.bot)
                return;
            const userId = message.author.id;
            // Check for message spam
            if (userMessages.has(userId)) {
                const userData = userMessages.get(userId);
                userData.count++;
                if (userData.count > messageLimit) {
                    userWarnings.set(userId, (userWarnings.get(userId) || 0) + 1);
                    userData.count = 0;
                    clearTimeout(userData.timer);
                    const warnings = userWarnings.get(userId);
                    if (warnings >= warningsLimit) {
                        const muteRole = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.roles.cache.find(role => role.name === 'Muted');
                        const member = (_b = message.guild) === null || _b === void 0 ? void 0 : _b.members.cache.get(userId);
                        if (muteRole && member) {
                            yield member.roles.add(muteRole);
                            message.channel.send(`${message.author.tag} has been muted for spamming.`);
                        }
                    }
                    else {
                        message.channel.send(`${message.author.tag}, please stop spamming. Warning ${warnings}/${warningsLimit}`);
                    }
                }
                else {
                    userData.timer = setTimeout(() => userMessages.delete(userId), timeLimit);
                }
            }
            else {
                userMessages.set(userId, {
                    count: 1,
                    timer: setTimeout(() => userMessages.delete(userId), timeLimit)
                });
            }
        });
    }
};
module.exports.guildMemberAdd = {
    name: 'guildMemberAdd',
    execute(member) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = Date.now();
            const guildId = member.guild.id;
            if (!joinTimes.has(guildId)) {
                joinTimes.set(guildId, []);
            }
            const guildJoinTimes = joinTimes.get(guildId);
            guildJoinTimes.push(now);
            // Clean up old join times
            const filteredJoinTimes = guildJoinTimes.filter(joinTime => now - joinTime < joinTimeLimit);
            joinTimes.set(guildId, filteredJoinTimes);
            if (filteredJoinTimes.length > joinLimit) {
                yield member.kick('Raid protection: too many joins in a short period');
                console.log(`Kicked ${member.user.tag} for raid protection.`);
                const alertChannel = member.guild.channels.cache.find(channel => channel.name === 'mod-log');
                if (alertChannel) {
                    alertChannel.send(`Kicked ${member.user.tag} for raid protection.`);
                }
            }
        });
    }
};
