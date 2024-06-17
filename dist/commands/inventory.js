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
const discord_js_1 = require("discord.js");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const inventoryPath = path_1.default.join(__dirname, 'json', 'inventory.json');
module.exports = {
    name: 'inventory',
    description: 'Display the inventory.',
    execute(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (message.author.bot)
                return;
            let inventory;
            try {
                inventory = JSON.parse(fs_1.default.readFileSync(inventoryPath, 'utf-8'));
            }
            catch (error) {
                console.error('Error reading inventory file:', error);
                return message.reply('There was an error accessing the inventory. Please try again later.');
            }
            // Check for mentioned user
            const mentionedUser = message.mentions.users.first();
            const userId = mentionedUser ? mentionedUser.id : message.author.id;
            const username = mentionedUser ? mentionedUser.username : message.author.username;
            const userInventory = inventory[userId];
            if (!userInventory || userInventory.length === 0) {
                return message.reply(`${username}'s inventory is empty.`);
            }
            // Count occurrences of each item
            const itemCounts = userInventory.reduce((counts, item) => {
                counts[item] = (counts[item] || 0) + 1;
                return counts;
            }, {});
            // Sort items alphabetically
            const sortedItems = Object.keys(itemCounts).sort();
            // Format the inventory output
            const formattedInventory = sortedItems
                .map(item => `${item} (x${itemCounts[item]})`)
                .join('\n');
            const inventoryEmbed = new discord_js_1.EmbedBuilder()
                .setColor('Blue')
                .setTitle(`${username}'s Inventory`)
                .setDescription(formattedInventory);
            return message.reply({ embeds: [inventoryEmbed] });
        });
    }
};
