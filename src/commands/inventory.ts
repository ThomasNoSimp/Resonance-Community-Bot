import { Message, EmbedBuilder } from 'discord.js';
import fs from 'fs';
import path from 'path';

const inventoryPath = path.join(__dirname, 'json', 'inventory.json');

module.exports = {
    name: 'inventory',
    description: 'Display the inventory.',
    async execute(message: Message) {
        if (message.author.bot) return;

        let inventory;
        try {
            inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf-8'));
        } catch (error) {
            console.error('Error reading inventory file:', error);
            return message.reply('There was an error accessing the inventory. Please try again later.');
        }

        // Check for mentioned user
        const mentionedUser = message.mentions.users.first();
        const userId = mentionedUser ? mentionedUser.id : message.author.id;
        const username = mentionedUser ? mentionedUser.username : message.author.username;

        const userInventory: string[] = inventory[userId];

        if (!userInventory || userInventory.length === 0) {
            return message.reply(`${username}'s inventory is empty.`);
        }

        // Count occurrences of each item
        const itemCounts = userInventory.reduce((counts: Record<string, number>, item: string) => {
            counts[item] = (counts[item] || 0) + 1;
            return counts;
        }, {} as Record<string, number>);

        // Sort items alphabetically
        const sortedItems = Object.keys(itemCounts).sort();

        // Format the inventory output
        const formattedInventory = sortedItems
            .map(item => `${item} (x${itemCounts[item]})`)
            .join('\n');

        const inventoryEmbed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle(`${username}'s Inventory`)
            .setDescription(formattedInventory);

        return message.reply({ embeds: [inventoryEmbed] });
    }
};
