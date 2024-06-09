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
exports.execute = exports.once = exports.name = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)(); // Ensure .env variables are loaded
const logChannelId = process.env.LOG_CHANNEL_ID;
if (!logChannelId) {
    throw new Error('LOG_CHANNEL_ID is not set in the environment variables.');
}
// At this point, TypeScript knows that logChannelId is a string
const logChannelIdString = logChannelId;
exports.name = 'messageDelete';
exports.once = false;
function execute(deletedMessage, client) {
    return __awaiter(this, void 0, void 0, function* () {
        // Ensure the client is ready
        if (!client.isReady()) {
            console.error('Client is not ready!');
            return;
        }
        // Check if the deleted message was sent by a bot or a system message
        if (deletedMessage.author.bot || deletedMessage.system)
            return;
        // Fetch the log channel
        const logChannel = client.channels.cache.get(logChannelIdString);
        if (!logChannel) {
            console.error('Log channel not found!');
            return;
        }
        // Send a message announcing the deletion in the log channel
        yield logChannel.send(`${deletedMessage.author.tag} deleted a message. Message: ${deletedMessage.content}`);
    });
}
exports.execute = execute;
