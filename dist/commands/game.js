"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
module.exports = {
    name: 'game',
    description: 'Play a fun game!',
    execute(message) {
        if (message.author.bot)
            return;
        const gameSelectionEmbed = new discord_js_1.EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Game Selection')
            .setDescription('Please select a game from the list below.')
            .addFields({ name: '```1. Number Guessing Game```', value: '`===============`' }, { name: '```2. Quiz Game```', value: '`===============`' }, { name: '```3. Memory Game```', value: '`===============`' }, 
        // Footer
        {
            name: 'Usage:',
            value: '`!game <option>` || Example usage: !game 1'
        });
        message.reply({ embeds: [gameSelectionEmbed] });
    }
};
