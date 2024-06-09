"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.viewShopButton = void 0;
const discord_js_1 = require("discord.js");
const viewShopButton = new discord_js_1.ActionRowBuilder()
    .addComponents(new discord_js_1.ButtonBuilder()
    .setCustomId('view_shop_id')
    .setLabel('View Shop')
    .setStyle(discord_js_1.ButtonStyle.Primary));
exports.viewShopButton = viewShopButton;
