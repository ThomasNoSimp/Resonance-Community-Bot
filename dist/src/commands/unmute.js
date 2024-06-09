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
const discord_js_1 = require("discord.js");
module.exports = {
    name: 'unmute',
    description: 'Unmute a user.',
    execute(message, args) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!((_a = message.member) === null || _a === void 0 ? void 0 : _a.permissions.has(discord_js_1.PermissionsBitField.Flags.Administrator))) {
                return message.reply('You do not have permission to use this command.');
            }
            const mentionedUser = message.mentions.users.first();
            if (!mentionedUser) {
                return message.reply('Please mention a valid user to unmute.');
            }
            const guild = message.guild;
            if (!guild)
                return;
            const member = guild.members.cache.get(mentionedUser.id);
            if (!member) {
                return message.reply('User not found in this guild.');
            }
            try {
                yield member.timeout(null, 'Unmuted by an administrator');
                message.channel.send(`${mentionedUser.tag} has been unmuted.`);
            }
            catch (error) {
                console.error(error);
                message.channel.send('An error occurred while unmuting the user.');
            }
        });
    },
};
