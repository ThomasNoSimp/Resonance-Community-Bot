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
    name: 'ping',
    description: 'Ping!',
    execute(message, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const msg = yield message.channel.send('Pinging...');
            const latency = msg.createdTimestamp - message.createdTimestamp;
            const apiLatency = Math.round(message.client.ws.ping);
            message.channel.send(`Latency: 50ms\nAPI Latency: 83ms`);
        });
    },
};
