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
module.exports = (client) => {
    client.on('messageDelete', (message) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!message.guild)
            return;
        // Check if the message has full content (not a partial message)
        if (message.partial) {
            try {
                yield message.fetch();
            }
            catch (error) {
                console.error('Failed to fetch the deleted message:', error);
                return;
            }
        }
        // Now message is definitely a full Message object
        if ((_a = message.author) === null || _a === void 0 ? void 0 : _a.bot)
            return;
        if (message.channel.type !== discord_js_1.ChannelType.GuildText)
            return;
        const mentions = message.mentions.users;
        if (mentions.size > 0 && message.author) { // Added check for message.author
            const mentionList = mentions.map(user => `<@${user.id}>`).join(', ');
            const textChannel = message.channel;
            textChannel.send(`Ghost ping detected! ${message.author.tag} mentioned ${mentionList} and then deleted the message.`);
        }
    }));
};
