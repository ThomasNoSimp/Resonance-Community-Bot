import { Message, EmbedBuilder } from 'discord.js';

module.exports = {
    name: 'help',
    description: 'Display help information.',
    execute(message: Message) {
        const helpEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Bot Help')
            .setDescription('Here are the available commands:')
            .addFields(
                { name: '```!ping```', value: 'Ping the bot to check its responsiveness.' },
                { name: '```!warn @user```', value: 'Warn a user. After 3 warnings, the user will be muted.' },
            );

        message.channel.send({ embeds: [helpEmbed] });
    },
};
