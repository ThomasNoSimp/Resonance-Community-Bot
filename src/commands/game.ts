import { EmbedBuilder, Message } from "discord.js";

// Create a set to track users who have accessed the game menu
const gameMenuAccessed = new Set<string>();

module.exports = {
    name: 'game',
    description: 'Play a fun game!',
    async execute(message: Message) {
        if (message.author.bot) return;

        const args = message.content.split(' ');

        if (args.length === 2) {
            const option = args[1];

            // Check if the user has accessed the game menu before
            if (!gameMenuAccessed.has(message.author.id)) {
                const accessWarningEmbed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('Access Denied')
                    .setDescription('Please use the `!game` command first to select a game.');

                message.reply({ embeds: [accessWarningEmbed] });
                return;
            }

            let loadingEmbed;
            switch (option) {
                case '1':
                    loadingEmbed = new EmbedBuilder()
                        .setColor('#0099ff')
                        .setTitle('Number Guessing Game')
                        .setDescription('Game Loading...');
                    break;
                case '2':
                    loadingEmbed = new EmbedBuilder()
                        .setColor('#0099ff')
                        .setTitle('Quiz Game')
                        .setDescription('Game Loading...');
                    break;
                case '3':
                    loadingEmbed = new EmbedBuilder()
                        .setColor('#0099ff')
                        .setTitle('Memory Game')
                        .setDescription('Game Loading...');
                    break;
                default:
                    const invalidOptionEmbed = new EmbedBuilder()
                        .setColor('#ff0000')
                        .setTitle('Invalid Option')
                        .setDescription('Please select a valid game option from the list.');
                    message.reply({ embeds: [invalidOptionEmbed] });
                    return;
            }

            // Send the loading embed
            const loadingMessage = await message.reply({ embeds: [loadingEmbed] });

            // Wait for 3 seconds
            setTimeout(async () => {
                let gameEmbed;
                switch (option) {
                    case '1':
                        gameEmbed = new EmbedBuilder()
                            .setColor('#0099ff')
                            .setTitle('Number Guessing Game')
                            .setDescription('Welcome to the Number Guessing Game! Here\'s how to play: \nJust guess the numbers.');
                        break;
                    case '2':
                        gameEmbed = new EmbedBuilder()
                            .setColor('#0099ff')
                            .setTitle('Quiz Game')
                            .setDescription('Welcome to the Quiz Game! Here\'s how to play: \nAnswer the correct questions, Simple Dimple!');
                        break;
                    case '3':
                        gameEmbed = new EmbedBuilder()
                            .setColor('#0099ff')
                            .setTitle('Memory Game')
                            .setDescription('Welcome to the Memory Game! Here\'s how to play: \nUse your brain to memorize the things.');
                        break;
                }

                // Edit the loading message to display the actual game embed
                await loadingMessage.edit({ embeds: [gameEmbed] });
            }, 3000);

        } else {
            // Add the user to the set indicating they have accessed the game menu
            gameMenuAccessed.add(message.author.id);

            const gameSelectionEmbed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Game Selection')
                .setDescription('Please select a game from the list below.')
                .addFields(
                    { name: '```1. Number Guessing Game```', value: '`===============`' },
                    { name: '```2. Quiz Game```', value: '`===============`' },
                    { name: '```3. Memory Game```', value: '`===============`' },
                    {
                        name: 'Usage:',
                        value: '`!game <option>` || Example usage: `!game 1`'
                    }
                );

            message.reply({ embeds: [gameSelectionEmbed] });
        }
    }
};
