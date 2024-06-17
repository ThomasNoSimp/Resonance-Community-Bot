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
    name: 'blockedPings',
    description: 'Block the certain pings.',
    execute(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (message.author.bot)
                return;
            const SinUserID = '996740835318186054';
            if (message.mentions.users.has(SinUserID)) {
                const member = message.member;
                if (member) {
                    try {
                        yield member.timeout(10 * 60 * 1000, 'Pinged Sin.');
                        message.channel.send(`${member.user.tag} has been muted for pinging Sin.`);
                    }
                    catch (error) {
                        console.error('Failed to mute the member:', error);
                        message.channel.send(`Failed to mute the member: ${error}`);
                    }
                }
            }
        });
    }
};
