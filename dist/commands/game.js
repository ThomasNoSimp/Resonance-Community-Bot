"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
module.exports = {
    name: 'game',
    description: 'Play a fun game!',
    execute(message) {
        if (message.author.bot)
            return;
        const mainEmbed = new discord_js_1.EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Notice')
            .setDescription('This command is still under development.');
        message.reply({ embeds: [mainEmbed] });
    }
};
