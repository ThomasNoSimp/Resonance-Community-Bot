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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shopEmbeds_1 = require("./components/shopEmbeds");
const shopComponents_1 = require("./components/shopComponents");
const shopItems_1 = require("./components/shopItems");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const resonanceCoinsPath = path_1.default.join(__dirname, 'json', 'resonanceCoins.json');
const inventoryPath = path_1.default.join(__dirname, 'json', 'inventory.json');
let resonanceCoins = JSON.parse(fs_1.default.readFileSync(resonanceCoinsPath, 'utf-8'));
let inventory = JSON.parse(fs_1.default.readFileSync(inventoryPath, 'utf-8'));
// Function to draw an item based on probability
function drawItem(contents) {
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
    execute(message, args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (message.author.bot)
                return;
            if (args[0] === 'buy') {
                const itemId = parseInt(args[1]);
                const userId = message.author.id;
                const item = shopItems_1.shopItems.find(i => i.id === itemId);
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
                fs_1.default.writeFileSync(resonanceCoinsPath, JSON.stringify(resonanceCoins, null, 2));
                // Add item to user's inventory
                if (!inventory[userId]) {
                    inventory[userId] = [];
                }
                inventory[userId].push(item.name);
                fs_1.default.writeFileSync(inventoryPath, JSON.stringify(inventory, null, 2));
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
                        role = yield guild.roles.create({
                            name: item.role,
                            reason: 'Role needed for shop item purchase',
                            position: position // Set the position of the created role
                        });
                        console.log(`Created role ${role.name}`);
                    }
                    catch (error) {
                        console.error('Error creating role:', error);
                        return message.reply('An error occurred while creating the role.');
                    }
                }
                const templateRole = guild.roles.cache.find(r => r.name.includes('TITLES'));
                if (!templateRole) {
                    return message.reply(`Template role is not found.`);
                }
                const member = yield guild.members.fetch(userId);
                if (!member) {
                    return message.reply('Member not found.');
                }
                yield member.roles.add(role);
                yield member.roles.add(templateRole);
                return message.reply(`You have successfully purchased **${item.name}** for ${item.price} coins and received the **${item.role}** role.`);
            }
            else {
                const sentMessage = yield message.reply({
                    embeds: [shopEmbeds_1.shopWelcomeEmbed],
                    components: [shopComponents_1.viewShopButton]
                });
                const filter = (interaction) => {
                    if (!interaction.isMessageComponent())
                        return false;
                    return (interaction.customId === 'view_shop_id');
                };
                const collector = sentMessage.createMessageComponentCollector({ filter, time: 60000 });
                collector.on('collect', (interaction) => __awaiter(this, void 0, void 0, function* () {
                    if (interaction.customId === 'view_shop_id') {
                        yield sentMessage.edit({ embeds: [shopEmbeds_1.shopEmbed], components: [] });
                        yield interaction.deferUpdate();
                    }
                }));
                collector.on('end', collected => {
                    if (collected.size === 0) {
                        sentMessage.edit({ components: [] });
                    }
                });
            }
        });
    }
};
