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
    name: 'mute',
    description: 'Mute a user.',
    execute(message, args) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!((_a = message.member) === null || _a === void 0 ? void 0 : _a.permissions.has(discord_js_1.PermissionsBitField.Flags.Administrator))) {
                return message.reply('You do not have permission to use this command.');
            }
            const mentionedUser = message.mentions.users.first();
            if (!mentionedUser) {
                return message.reply('Please mention a valid user to mute.');
            }
            const guild = message.guild;
            if (!guild)
                return;
            const member = guild.members.cache.get(mentionedUser.id);
            if (!member) {
                return message.reply('User not found in this guild.');
            }
            let muteRole = guild.roles.cache.find(role => role.name === 'Muted');
            if (!muteRole) {
                try {
                    muteRole = yield guild.roles.create({
                        name: 'Muted',
                        permissions: [],
                    });
                    guild.channels.cache.forEach((channel) => __awaiter(this, void 0, void 0, function* () {
                        if (channel instanceof discord_js_1.TextChannel ||
                            channel instanceof discord_js_1.VoiceChannel ||
                            channel instanceof discord_js_1.NewsChannel ||
                            channel instanceof discord_js_1.StageChannel ||
                            channel instanceof discord_js_1.CategoryChannel) {
                            yield channel.permissionOverwrites.create(muteRole, {
                                SendMessages: false,
                                AddReactions: false,
                                Speak: false,
                                Stream: false,
                            });
                        }
                    }));
                    message.channel.send('Muted role has been created.');
                }
                catch (error) {
                    console.error(error);
                    return message.channel.send('An error occurred while creating the Muted role.');
                }
            }
            if (member.roles.cache.has(muteRole.id)) {
                return message.reply('This user is already muted.');
            }
            try {
                yield member.roles.add(muteRole);
                message.channel.send(`${mentionedUser.tag} has been muted.`);
            }
            catch (error) {
                console.error(error);
                message.channel.send('An error occurred while muting the user.');
            }
        });
    },
};
