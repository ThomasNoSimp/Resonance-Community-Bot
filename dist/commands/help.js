"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
module.exports = {
    name: 'help',
    description: 'Display help information.',
    execute(message) {
        const helpEmbed = new discord_js_1.EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Bot Help')
            .setDescription('Here are the available commands:')
            .addFields({ name: '```!ping```', value: 'Ping the bot to check its responsiveness.' }, { name: '```!warn @user```', value: 'Warn a user. After 3 warnings, the user will be muted.' });
        message.channel.send({ embeds: [helpEmbed] });
    },
};
