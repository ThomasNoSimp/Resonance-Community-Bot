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
            .addFields({ name: '```!ping```', value: 'Ping the bot to check its responsiveness.' }, { name: '```!repeat```', value: 'Toggle repeat mode. When enabled, the bot will repeat every message sent by members.' }, { name: '```!repeat --test```', value: 'Toogle repeat mode for testing purpose. When enabled, the bot will repeat every message sent in the test channel.' }, { name: '```!mute @user```', value: 'Mute a user.' });
        message.channel.send({ embeds: [helpEmbed] });
    },
};
