import { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } from 'discord.js';
import { shopItems } from './shopItems';

const viewShopButton = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('view_shop_id')
            .setLabel('View Shop')
            .setStyle(ButtonStyle.Primary)
    );

export { viewShopButton};
