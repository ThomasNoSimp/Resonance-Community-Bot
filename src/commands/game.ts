import { Embed, Message, EmbedBuilder } from 'discord.js';

module.exports = {
    name: 'game',
    description: 'Play a fun game!',
    execute(message: Message) {
        if (message.author.bot) return;

        const mainEmbed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Notice')
                .setDescription('This command is still under development.')

        message.reply({ embeds: [mainEmbed] });
    }
};
