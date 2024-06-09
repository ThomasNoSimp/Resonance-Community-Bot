import { Message, TextChannel, Client } from 'discord.js';
import { config } from 'dotenv';

config(); // Ensure .env variables are loaded

const logChannelId = process.env.LOG_CHANNEL_ID;

if (!logChannelId) {
    throw new Error('LOG_CHANNEL_ID is not set in the environment variables.');
}

// At this point, TypeScript knows that logChannelId is a string
const logChannelIdString: string = logChannelId as string;

export const name = 'messageDelete';
export const once = false;

export async function execute(deletedMessage: Message, client: Client) {
    // Ensure the client is ready
    if (!client.isReady()) {
        console.error('Client is not ready!');
        return;
    }

    // Check if the deleted message was sent by a bot or a system message
    if (deletedMessage.author.bot || deletedMessage.system) return;

    // Fetch the log channel
    const logChannel = client.channels.cache.get(logChannelIdString) as TextChannel;
    if (!logChannel) {
        console.error('Log channel not found!');
        return;
    }

    // Send a message announcing the deletion in the log channel
    await logChannel.send(`${deletedMessage.author.tag} deleted a message. Message: ${deletedMessage.content}`);
}
