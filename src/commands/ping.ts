import { Message } from 'discord.js';

module.exports = {
    name: 'ping',
    description: 'Ping!',
    async execute(message: Message, args: string[]) {
        const msg = await message.channel.send('Pinging...');
        const latency = msg.createdTimestamp - message.createdTimestamp;
        const apiLatency = Math.round(message.client.ws.ping);
        message.channel.send(`Latency: ${latency}ms\nAPI Latency: ${apiLatency}ms`);
    },
};
