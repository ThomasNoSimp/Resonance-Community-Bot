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
const warnings = new Map();
module.exports = {
    name: 'warn',
    description: 'Warn a user. After 3 warnings, the user will be muted.',
    execute(message, args) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            if (!((_a = message.member) === null || _a === void 0 ? void 0 : _a.permissions.has(discord_js_1.PermissionsBitField.Flags.ManageMessages))) {
                return message.reply('You do not have permission to use this command.');
            }
            const user = message.mentions.users.first();
            if (!user) {
                return message.reply('Please mention a user to warn.');
            }
            const member = (_b = message.guild) === null || _b === void 0 ? void 0 : _b.members.cache.get(user.id);
            if (!member) {
                return message.reply('User not found in this guild.');
            }
            const userId = user.id;
            const currentWarnings = warnings.get(userId) || 0;
            const newWarnings = currentWarnings + 1;
            warnings.set(userId, newWarnings);
            if (newWarnings >= 3) {
                const muteRole = (_c = message.guild) === null || _c === void 0 ? void 0 : _c.roles.cache.find(role => role.name === 'Muted');
                if (!muteRole) {
                    return message.reply('Muted role not found. Please create a role named "Muted".');
                }
                yield member.roles.add(muteRole);
                message.channel.send(`${user.tag} has been muted for receiving 3 warnings.`);
            }
            else {
                message.channel.send(`${user.tag} has been warned. They now have ${newWarnings} warning(s).`);
            }
        });
    },
};
