import { Message, EmbedBuilder } from 'discord.js';
import * as fs from 'fs';
import * as path from 'path';

const resonanceCoinsFilePath = path.join(__dirname, 'json', 'resonanceCoins.json');

const ensureResonanceCoinsFileExists = () => {
    const dir = path.dirname(resonanceCoinsFilePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(resonanceCoinsFilePath)) {
        fs.writeFileSync(resonanceCoinsFilePath, JSON.stringify({}, null, 2), 'utf8');
    }
};

const loadResonanceCoins = () => {
    ensureResonanceCoinsFileExists();
    try {
        const data = fs.readFileSync(resonanceCoinsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading resonanceCoins.json:', err);
        return {};
    }
};

const saveResonanceCoins = (resonanceCoins: { [key: string]: number }) => {
    try {
        fs.writeFileSync(resonanceCoinsFilePath, JSON.stringify(resonanceCoins, null, 2), 'utf8');
    } catch (err) {
        console.error('Error writing to resonanceCoins.json:', err);
    }
};

module.exports = {
    name: 'balance',
    description: 'Check your coin balance',
    async execute(message: Message) {
        if (message.author.bot) return;

        const resonanceCoins = loadResonanceCoins();
        const mentionedUser = message.mentions.users.first();
        const userId = mentionedUser ? mentionedUser.id : message.author.id;
        const userName = mentionedUser ? mentionedUser.username : message.author.username;
        const userCoins = resonanceCoins[userId] || 0;

        const balanceEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`${userName}'s Coin Balance`)
            .setDescription(`You have ${userCoins} Resonance Coins.`);

        await message.reply({ embeds: [balanceEmbed] });
    },
};
