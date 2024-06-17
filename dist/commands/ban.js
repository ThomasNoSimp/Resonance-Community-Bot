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
module.exports = {
    name: 'ban',
    description: 'Bans a user.',
    execute(message) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            // Check if the message author is a bot
            if (message.author.bot)
                return;
            // Check if the message is sent in a guild
            if (!message.guild) {
                return message.reply('This command can only be used in a server.');
            }
            // Check if the message author has administrative permissions
            if (!((_a = message.member) === null || _a === void 0 ? void 0 : _a.permissions.has('BanMembers'))) {
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
                yield message.guild.members.ban(userToBan);
                message.reply(`Successfully banned ${userToBan.tag}.`);
            }
            catch (error) {
                console.error(error);
                message.reply('There was an error trying to ban that user.');
            }
        });
    }
};
