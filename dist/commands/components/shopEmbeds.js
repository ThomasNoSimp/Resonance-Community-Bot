"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shopEmbed = exports.shopWelcomeEmbed = void 0;
const discord_js_1 = require("discord.js");
const shopItems_1 = require("./shopItems");
const shopWelcomeEmbed = new discord_js_1.EmbedBuilder()
    .setColor('Green')
    .setTitle('Shop')
    .setDescription('Welcome to the Resonance Shop! Here, you can use your Resonance Coins to exchange items.');
exports.shopWelcomeEmbed = shopWelcomeEmbed;
const itemFields = shopItems_1.shopItems.map(item => ({
    name: `${item.id} - ${item.name} (${item.category})`,
    value: `Price: ${item.price} Resonance Coins \nRarity: ${item.rarity}`,
    inline: false,
}));
const agreementField = {
    name: 'Agreements',
    value: 'By typing ```!shop buy <id>```, you agree to our terms and your coins will be paid as soon as you execute the command.',
    inline: false,
};
const shopEmbed = new discord_js_1.EmbedBuilder()
    .setColor('Green')
    .setTitle('Shop')
    .setDescription('Here are the available items that you can exchange using your Resonance Coins:')
    .addFields(...itemFields, agreementField);
exports.shopEmbed = shopEmbed;
