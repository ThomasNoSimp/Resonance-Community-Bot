import { createCanvas, loadImage } from 'canvas';
import { Message, TextChannel, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Interaction } from 'discord.js';
import * as fs from 'fs';
import * as path from 'path';

// Create a set to track users who have accessed the game menu
const gameMenuAccessed = new Set<string>();

// Load quiz questions from JSON file
let quizQuestions: { question: string; answer: string }[] = [];
try {
    const data = fs.readFileSync(path.join(__dirname, './json/quizQuestions.json'), 'utf8');
    quizQuestions = JSON.parse(data);
    console.log('Quiz questions loaded successfully.');
} catch (err) {
    console.error('Error reading quizQuestions.json:', err);
}

// Load user data from JSON file
let userData: { [key: string]: { coins: number } } = {};
try {
    const data = fs.readFileSync(path.join(__dirname, './json/userData.json'), 'utf8');
    userData = JSON.parse(data);
    console.log('User data loaded successfully.');
} catch (err) {
    console.error('Error reading userData.json:', err);
}

// Save user data to JSON file
const saveUserData = () => {
    fs.writeFileSync(path.join(__dirname, './json/userData.json'), JSON.stringify(userData, null, 2), 'utf8');
}


// Helper function to create the game grid
const createGrid = (rows: number, cols: number) => {
    const items = ['🍬', '🍭', '🍫', '🍪']; // Sample items
    let grid: string[][] = [];
    for (let r = 0; r < rows; r++) {
        let row: string[] = [];
        for (let c = 0; c < cols; c++) {
            row.push(items[Math.floor(Math.random() * items.length)]);
        }
        grid.push(row);
    }
    return grid;
}

// Helper function to display the grid as buttons
const displayGridAsButtons = (grid: string[][]) => {
    let rows: ActionRowBuilder<ButtonBuilder>[] = [];

    for (let r = 0; r < grid.length; r++) {
        let actionRow = new ActionRowBuilder<ButtonBuilder>();
        for (let c = 0; c < grid[r].length; c++) {
            actionRow.addComponents(
                new ButtonBuilder()
                    .setCustomId(`cell_${r}_${c}`)
                    .setLabel(grid[r][c])
                    .setStyle(ButtonStyle.Primary)
            );
        }
        rows.push(actionRow);
    }

    return rows;
}

// Helper function to check if two cells are adjacent
const areAdjacent = (cell1: [number, number], cell2: [number, number]) => {
    const [r1, c1] = cell1;
    const [r2, c2] = cell2;

    return (r1 === r2 && Math.abs(c1 - c2) === 1) || (c1 === c2 && Math.abs(r1 - r2) === 1);
}

// Helper function to check for matches of 3 in the grid
const hasMatchesOfThree = (grid: string[][]) => {
    // Check horizontal matches
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length - 2; c++) {
            if (grid[r][c] === grid[r][c + 1] && grid[r][c] === grid[r][c + 2]) {
                return true;
            }
        }
    }
    // Check vertical matches
    for (let c = 0; c < grid[0].length; c++) {
        for (let r = 0; r < grid.length - 2; r++) {
            if (grid[r][c] === grid[r + 1][c] && grid[r][c] === grid[r + 2][c]) {
                return true;
            }
        }
    }
    return false;
}

// Function to shuffle the grid until no initial matches of 3 are found
const shuffleGrid = (grid: string[][]) => {
    do {
        for (let r = 0; r < grid.length; r++) {
            for (let c = 0; c < grid[r].length; c++) {
                const newR = Math.floor(Math.random() * grid.length);
                const newC = Math.floor(Math.random() * grid[r].length);
                [grid[r][c], grid[newR][newC]] = [grid[newR][newC], grid[r][c]];
            }
        }
    } while (hasMatchesOfThree(grid));
    return grid;
}

// Function to create an image from the shuffled items
const createMemoryImage = async (items: string[]) => {
    const canvas = createCanvas(500, 500);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#000000';
    ctx.font = '30px Arial';

    const padding = 10;
    let y = 50;
    for (const item of items) {
        ctx.fillText(item, padding, y);
        y += 40;
    }

    const buffer = canvas.toBuffer('image/png');
    return buffer;
}

// Main module
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

                await message.reply({ embeds: [accessWarningEmbed] });
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
                case '4':
                    loadingEmbed = new EmbedBuilder()
                        .setColor('#0099ff')
                        .setTitle('Match-3 Game')
                        .setDescription('Game Loading...');
                    break;
                default:
                    const invalidOptionEmbed = new EmbedBuilder()
                        .setColor('#ff0000')
                        .setTitle('Invalid Option')
                        .setDescription('Please select a valid game option from the list.');
                    await message.reply({ embeds: [invalidOptionEmbed] });
                    return;
            }

            // Send the loading embed
            const loadingMessage = await message.reply({ embeds: [loadingEmbed] });

            // Wait for 3 seconds
            setTimeout(async () => {
                let gameInstructionsEmbed;
                switch (option) {
                    case '1':
                        gameInstructionsEmbed = new EmbedBuilder()
                            .setColor('#0099ff')
                            .setTitle('Number Guessing Game')
                            .setDescription('Welcome to the Number Guessing Game! Here\'s how to play: \nJust guess the numbers. \nClosing and Starting the game in 3s...');
                        break;
                    case '2':
                        gameInstructionsEmbed = new EmbedBuilder()
                            .setColor('#0099ff')
                            .setTitle('Quiz Game')
                            .setDescription('Welcome to the Quiz Game! Here\'s how to play: \nAnswer the correct questions, Simple Dimple! \nClosing and Starting the game in 3s...');
                        break;
                    case '3':
                        gameInstructionsEmbed = new EmbedBuilder()
                            .setColor('#0099ff')
                            .setTitle('Memory Game')
                            .setDescription('Welcome to the Memory Game! Here\'s how to play: \nUse your brain to memorize the things. \nClosing and Starting the game in 3s...');
                        break;
                    case '4':
                        gameInstructionsEmbed = new EmbedBuilder()
                            .setColor('#0099ff')
                            .setTitle('Match-3 Game')
                            .setDescription('Welcome to the Match-3 Game! Here\'s how to play: \nSwap adjacent items to match 3 or more in a row. \nClosing and Starting the game in 3s...');
                        break;
                }

                // Edit the loading message to display the game instructions embed
                await loadingMessage.edit({ embeds: [gameInstructionsEmbed] });
            }, 3000);

            setTimeout(async () => {
                switch (option) {
                    case '1':
                        // Generate a random number between 1 and 100
                        const randomNumber = Math.floor(Math.random() * 100) + 1;

                        // Set up a variable to track the number of attempts
                        let attempts = 0;

                        await message.channel.send('I\'m thinking a number between 1 and 100.');

                        const numberCollector = message.channel.createMessageCollector({
                            filter: (response) => !isNaN(Number(response.content)) && response.author.id === message.author.id,
                            time: 60000, // 60 seconds
                            max: 10 // Maximum of 10 attempts
                        });

                        numberCollector.on('collect', async (msg) => {
                            const guessedNumber = parseInt(msg.content);

                            // Increment the attempts
                            attempts++;

                            if (guessedNumber === randomNumber) {
                                numberCollector.stop();
                                const winEmbed = new EmbedBuilder()
                                    .setColor('#00ff00')
                                    .setTitle('Number Guessing Game')
                                    .setDescription(`Congratulations! You guessed the correct number (${randomNumber}) in ${attempts} attempts!`);
                                await message.channel.send({ embeds: [winEmbed] });

                                // Award Resonance Coins
                                awardCoins(message.author.id, 10);
                            } else {
                                if (guessedNumber > randomNumber) {
                                    await message.channel.send('Too high! Try again.');
                                } else {
                                    await message.channel.send('Too low! Try again.');
                                }
                            }
                        });

                        numberCollector.on('end', async (collected, reason) => {
                            if (reason === 'time') {
                                const timeoutEmbed = new EmbedBuilder()
                                    .setColor('#ff0000')
                                    .setTitle('Number Guessing Game')
                                    .setDescription('Sorry, you ran out of time! The game is over.');
                                await message.channel.send({ embeds: [timeoutEmbed] });
                            }
                        });
                        break;
                    case '2':
                        // Select a random question
                        const randomQuestion = quizQuestions[Math.floor(Math.random() * quizQuestions.length)];
                    
                        // Send the question to the user
                        await message.channel.send(randomQuestion.question);
                    
                        // Set up a collector to listen for the answer
                        const answerCollector = message.channel.createMessageCollector({
                            filter: (response) => response.content.toLowerCase() === randomQuestion.answer.toLowerCase() && response.author.id === message.author.id,
                            time: 30000, // 30 seconds
                            max: 1 // Only allow one answer
                        });
                    
                        answerCollector.on('collect', async () => {
                            const winEmbed = new EmbedBuilder()
                                .setColor('#00ff00')
                                .setTitle('Quiz Game')
                                .setDescription('Congratulations! You answered correctly!');
                            await message.channel.send({ embeds: [winEmbed] });

                            // Award Resonance Coins
                            awardCoins(message.author.id, 10);
                            answerCollector.stop();
                        });
                    
                        answerCollector.on('end', async (collected, reason) => {
                            if (reason === 'time') {
                                const timeoutEmbed = new EmbedBuilder()
                                    .setColor('#ff0000')
                                    .setTitle('Quiz Game')
                                    .setDescription('Sorry, you ran out of time! The correct answer was: ' + randomQuestion.answer);
                                await message.channel.send({ embeds: [timeoutEmbed] });
                            }
                        });
                        break;                        
                    case '3':
                        // Define memory game items
                        const memoryItems = ['Apple', 'Banana', 'Orange', 'Grapes', 'Watermelon', 'Pineapple'];
                    
                        // Shuffle the items
                        const shuffledItems = memoryItems.sort(() => Math.random() - 0.5);
                    
                        // Create an image from the shuffled items
                        const memoryImage = await createMemoryImage(shuffledItems);
                    
                        // Send the image to the user
                        const memoryEmbed = new EmbedBuilder()
                            .setColor('#00ff00')
                            .setTitle('Memory Game')
                            .setDescription('Remember the order of the items below:');
                        await message.channel.send({ embeds: [memoryEmbed], files: [{ attachment: memoryImage, name: 'memory.png' }] });
                    
                        // Wait for 10 seconds for the user to memorize the items
                        await new Promise(resolve => setTimeout(resolve, 10000));
                    
                        // Clear the chat (only in a guild channel, not in a DM)
                        if (message.channel instanceof TextChannel) {
                            const fetchedMessages = await message.channel.messages.fetch({ limit: 1 });
                            await message.channel.bulkDelete(fetchedMessages);
                        }
                    
                        // Prompt the user to recall the items
                        await message.channel.send('Type the items you remembered, separated by commas (e.g., Apple, Banana, Orange)');
                    
                        // Set up a collector to listen for the user's response
                        const memoryCollector = message.channel.createMessageCollector({
                            filter: (response) => response.author.id === message.author.id,
                            time: 30000, // 30 seconds
                            max: 1 // Only allow one response
                        });
                    
                        memoryCollector.on('collect', async (msg) => {
                            const userItems = msg.content.toLowerCase().split(',').map(item => item.trim());
                            const correctItems = shuffledItems.map(item => item.toLowerCase());
                    
                            if (JSON.stringify(userItems.sort()) === JSON.stringify(correctItems.sort())) {
                                const winEmbed = new EmbedBuilder()
                                    .setColor('#00ff00')
                                    .setTitle('Memory Game')
                                    .setDescription('Congratulations! You remembered all the items correctly!');
                                await message.channel.send({ embeds: [winEmbed] });

                                // Award Resonance Coins
                                awardCoins(message.author.id, 10);
                            } else {
                                const loseEmbed = new EmbedBuilder()
                                    .setColor('#ff0000')
                                    .setTitle('Memory Game')
                                    .setDescription('Sorry, you got some items wrong! Better luck next time.');
                                await message.channel.send({ embeds: [loseEmbed] });
                            }
                            memoryCollector.stop();
                        });
                    
                        memoryCollector.on('end', async (collected, reason) => {
                            if (reason === 'time') {
                                const timeoutEmbed = new EmbedBuilder()
                                    .setColor('#ff0000')
                                    .setTitle('Memory Game')
                                    .setDescription('Sorry, you ran out of time! The game is over.');
                                await message.channel.send({ embeds: [timeoutEmbed] });
                            }
                        });
                        break;
                    case '4':
                        // Match-3 game logic
                        let grid = createGrid(5, 4);
                        grid = shuffleGrid(grid);
                        let firstSelection: [number, number] | null = null;
                        let secondSelection: [number, number] | null = null;

                        const gridButtons = displayGridAsButtons(grid);

                        const gridMessage = await message.channel.send({
                            content: 'Match-3 Game: Click two adjacent items to swap them.',
                            components: gridButtons
                        });

                        const matchCollector = message.channel.createMessageComponentCollector({
                            filter: (interaction: Interaction) => interaction.isButton() && interaction.user.id === message.author.id,
                            time: 60000 // 60 seconds
                        });

                        matchCollector.on('collect', async (interaction) => {
                            if (!interaction.isButton()) return;
                            const [_, row, col] = interaction.customId.split('_').map(Number);

                            if (firstSelection === null) {
                                firstSelection = [row, col];
                            } else {
                                secondSelection = [row, col];

                                if (areAdjacent(firstSelection, secondSelection)) {
                                    // Swap the items
                                    const [r1, c1] = firstSelection;
                                    const [r2, c2] = secondSelection;
                                    const temp = grid[r1][c1];
                                    grid[r1][c1] = grid[r2][c2];
                                    grid[r2][c2] = temp;

                                    // Check for matches after the swap
                                    if (hasMatchesOfThree(grid)) {
                                        matchCollector.stop();
                                        const winEmbed = new EmbedBuilder()
                                            .setColor('#00ff00')
                                            .setTitle('Match-3 Game')
                                            .setDescription('Congratulations! You made a match of 3 or more items!');
                                        await message.channel.send({ embeds: [winEmbed] });

                                        // Award Resonance Coins
                                        awardCoins(message.author.id, 10);
                                    } else {
                                        // Update the grid display
                                        const updatedGridButtons = displayGridAsButtons(grid);
                                        await gridMessage.edit({ components: updatedGridButtons });
                                    }
                                } else {
                                    await interaction.reply({ content: 'Items are not adjacent. Please select adjacent items.', ephemeral: true });
                                }

                                // Reset selections
                                firstSelection = null;
                                secondSelection = null;
                            }
                        });

                        matchCollector.on('end', async (collected, reason) => {
                            if (reason === 'time') {
                                const timeoutEmbed = new EmbedBuilder()
                                    .setColor('#ff0000')
                                    .setTitle('Match-3 Game')
                                    .setDescription('Sorry, you ran out of time! The game is over.');
                                await message.channel.send({ embeds: [timeoutEmbed] });
                            }
                        });
                        break;
                }
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
                    { name: '```4. Match-3 Game```', value: '`===============`' },
                    {
                        name: 'Usage:',
                        value: '`!game <option>` || Example usage: `!game 1`'
                    }
                );

            await message.reply({ embeds: [gameSelectionEmbed] });
        }
    }
};

// Helper function to award Resonance Coins
const awardCoins = (userId: string, amount: number) => {
    const filePath = path.join(__dirname, './json/resonanceCoins.json');
    let resonanceCoins: { [key: string]: number } = {};

    try {
        const data = fs.readFileSync(filePath, 'utf8');
        resonanceCoins = JSON.parse(data);
    } catch (err) {
        console.error('Error reading resonanceCoins.json:', err);
    }

    if (!resonanceCoins[userId]) {
        resonanceCoins[userId] = 0;
    }

    resonanceCoins[userId] += amount;

    try {
        fs.writeFileSync(filePath, JSON.stringify(resonanceCoins, null, 2), 'utf8');
    } catch (err) {
        console.error('Error writing to resonanceCoins.json:', err);
    }
}
