import { EmbedBuilder, Message, APIEmbedField, ActionRowBuilder, ButtonBuilder, ButtonStyle, APIEmbed } from 'discord.js';
import { shopItems } from './shopItems';

const shopWelcomeEmbed = new EmbedBuilder()
    .setColor('Green')
    .setTitle('Shop')
    .setDescription('Welcome to the Resonance Shop! Here, you can use your Resonance Coins to exchange items.');

const itemFields: APIEmbedField[] = shopItems.map(item => ({
    name: `${item.id} - ${item.name} (${item.category})`,
    value: `Price: ${item.price} Resonance Coins \nRarity: ${item.rarity}`,
    inline: false,
}));

const agreementField: APIEmbedField = {
    name: 'Agreements',
    value: 'By typing ```!shop buy <id>```, you agree to our terms and your coins will be paid as soon as you execute the command.',
    inline: false,
};

const shopEmbed = new EmbedBuilder()
    .setColor('Green')
    .setTitle('Shop')
    .setDescription('Here are the available items that you can exchange using your Resonance Coins:')
    .addFields(
        ...itemFields,
        agreementField
    );

export { shopWelcomeEmbed, shopEmbed };
