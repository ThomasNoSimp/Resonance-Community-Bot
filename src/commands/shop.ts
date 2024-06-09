// shop.ts
import { Message, ButtonInteraction, Interaction, MessageComponentInteraction, GuildMember } from 'discord.js';
import { shopWelcomeEmbed, shopEmbed } from './components/shopEmbeds';
import { viewShopButton } from './components/shopComponents';
import { shopItems } from './components/shopItems';
import fs from 'fs';
import path from 'path';

const resonanceCoinsPath = path.join(__dirname, 'json', 'resonanceCoins.json');
let resonanceCoins = JSON.parse(fs.readFileSync(resonanceCoinsPath, 'utf-8'));

// Function to draw an item based on probability
function drawItem(contents: { name: string, probability: number }[]) {
    const rand = Math.random();
    let sum = 0;

    for (const item of contents) {
        sum += item.probability;
        if (rand < sum) {
            return item.name;
        }
    }
    return null; // Fallback in case something goes wrong
}

module.exports = {
    name: 'shop',
    description: 'Display the shop interface.',
    async execute(message: Message, args: string[]) {
        if (message.author.bot) return;

        if (args[0] === 'buy') {
            const itemId = parseInt(args[1]);
            const userId = message.author.id;
            const item: any = shopItems.find(i => i.id === itemId);

            if (!item) {
                return message.reply('Invalid item ID.');
            }

            // Ensure user's balance is a number
            if (typeof resonanceCoins[userId] !== 'number') {
                resonanceCoins[userId] = 0;
            }

            if (resonanceCoins[userId] < item.price) {
                return message.reply('You do not have enough coins to buy this item.');
            }

            // Deduct item price from user's balance
            resonanceCoins[userId] -= item.price;
            fs.writeFileSync(resonanceCoinsPath, JSON.stringify(resonanceCoins, null, 2));

            if (item.category === 'Crate') {
                const drawnItem = drawItem(item.contents);
                return message.reply(`You have successfully purchased a **${item.name}** and received **${drawnItem}**!`);
            }

            // Add role to user
            const guild = message.guild;
            if (!guild) {
                return message.reply('Guild not found.');
            }

            let role = guild.roles.cache.find(r => r.name === item.role);
            if (!role) {
                const templateRole = guild.roles.cache.find(r => r.name.includes('TITLES'));
                let position = 0; // Default position if templateRole is not found
                if (templateRole) {
                    position = templateRole.position - 1; // Set position below templateRole
                }
                try {
                    role = await guild.roles.create({
                        name: item.role,
                        reason: 'Role needed for shop item purchase',
                        position: position // Set the position of the created role
                    });
                    console.log(`Created role ${role.name}`);
                } catch (error) {
                    console.error('Error creating role:', error);
                    return message.reply('An error occurred while creating the role.');
                }
            }

            const templateRole = guild.roles.cache.find(r => r.name.includes('TITLES'));
            if (!templateRole) {
                return message.reply(`Template role is not found.`);
            }

            const member = await guild.members.fetch(userId);
            if (!member) {
                return message.reply('Member not found.');
            }

            await member.roles.add(role);
            await member.roles.add(templateRole);

            return message.reply(`You have successfully purchased **${item.name}** for ${item.price} coins and received the **${item.role}** role.`);
        } else {
            const sentMessage = await message.reply({ 
                embeds: [shopWelcomeEmbed], 
                components: [viewShopButton]
            });

            const filter = (interaction: Interaction) => {
                if (!interaction.isMessageComponent()) return false;
                return (interaction.customId === 'view_shop_id');
            };

            const collector = sentMessage.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async (interaction: MessageComponentInteraction) => {
                if (interaction.customId === 'view_shop_id') {
                    await sentMessage.edit({ embeds: [shopEmbed], components: [] });
                    await interaction.deferUpdate();
                }
            });

            collector.on('end', collected => {
                if (collected.size === 0) {
                    sentMessage.edit({ components: [] });
                }
            });
        }
    }
};
