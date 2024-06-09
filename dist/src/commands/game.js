"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const canvas_1 = require("canvas");
const discord_js_1 = require("discord.js");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// Create a set to track users who have accessed the game menu
const gameMenuAccessed = new Set();
// Load quiz questions from JSON file
let quizQuestions = [];
try {
    const data = fs.readFileSync(path.join(__dirname, './json/quizQuestions.json'), 'utf8');
    quizQuestions = JSON.parse(data);
    console.log('Quiz questions loaded successfully.');
}
catch (err) {
    console.error('Error reading quizQuestions.json:', err);
}
// Load user data from JSON file
let userData = {};
try {
    const data = fs.readFileSync(path.join(__dirname, './json/userData.json'), 'utf8');
    userData = JSON.parse(data);
    console.log('User data loaded successfully.');
}
catch (err) {
    console.error('Error reading userData.json:', err);
}
// Save user data to JSON file
const saveUserData = () => {
    fs.writeFileSync(path.join(__dirname, './json/userData.json'), JSON.stringify(userData, null, 2), 'utf8');
};
// Helper function to create the game grid
const createGrid = (rows, cols) => {
    const items = ['🍬', '🍭', '🍫', '🍪']; // Sample items
    let grid = [];
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < cols; c++) {
            row.push(items[Math.floor(Math.random() * items.length)]);
        }
        grid.push(row);
    }
    return grid;
};
// Helper function to display the grid as buttons
const displayGridAsButtons = (grid) => {
    let rows = [];
    for (let r = 0; r < grid.length; r++) {
        let actionRow = new discord_js_1.ActionRowBuilder();
        for (let c = 0; c < grid[r].length; c++) {
            actionRow.addComponents(new discord_js_1.ButtonBuilder()
                .setCustomId(`cell_${r}_${c}`)
                .setLabel(grid[r][c])
                .setStyle(discord_js_1.ButtonStyle.Primary));
        }
        rows.push(actionRow);
    }
    return rows;
};
// Helper function to check if two cells are adjacent
const areAdjacent = (cell1, cell2) => {
    const [r1, c1] = cell1;
    const [r2, c2] = cell2;
    return (r1 === r2 && Math.abs(c1 - c2) === 1) || (c1 === c2 && Math.abs(r1 - r2) === 1);
};
// Helper function to check for matches of 3 in the grid
const hasMatchesOfThree = (grid) => {
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
};
// Function to shuffle the grid until no initial matches of 3 are found
const shuffleGrid = (grid) => {
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
};
// Function to create an image from the shuffled items
const createMemoryImage = (items) => __awaiter(void 0, void 0, void 0, function* () {
    const canvas = (0, canvas_1.createCanvas)(500, 500);
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
});
// Main module
module.exports = {
    name: 'game',
    description: 'Play a fun game!',
    execute(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (message.author.bot)
                return;
            const args = message.content.split(' ');
            if (args.length === 2) {
                const option = args[1];
                // Check if the user has accessed the game menu before
                if (!gameMenuAccessed.has(message.author.id)) {
                    const accessWarningEmbed = new discord_js_1.EmbedBuilder()
                        .setColor('#ff0000')
                        .setTitle('Access Denied')
                        .setDescription('Please use the `!game` command first to select a game.');
                    yield message.reply({ embeds: [accessWarningEmbed] });
                    return;
                }
                let loadingEmbed;
                switch (option) {
                    case '1':
                        loadingEmbed = new discord_js_1.EmbedBuilder()
                            .setColor('#0099ff')
                            .setTitle('Number Guessing Game')
                            .setDescription('Game Loading...');
                        break;
                    case '2':
                        loadingEmbed = new discord_js_1.EmbedBuilder()
                            .setColor('#0099ff')
                            .setTitle('Quiz Game')
                            .setDescription('Game Loading...');
                        break;
                    case '3':
                        loadingEmbed = new discord_js_1.EmbedBuilder()
                            .setColor('#0099ff')
                            .setTitle('Memory Game')
                            .setDescription('Game Loading...');
                        break;
                    case '4':
                        loadingEmbed = new discord_js_1.EmbedBuilder()
                            .setColor('#0099ff')
                            .setTitle('Match-3 Game')
                            .setDescription('Game Loading...');
                        break;
                    default:
                        const invalidOptionEmbed = new discord_js_1.EmbedBuilder()
                            .setColor('#ff0000')
                            .setTitle('Invalid Option')
                            .setDescription('Please select a valid game option from the list.');
                        yield message.reply({ embeds: [invalidOptionEmbed] });
                        return;
                }
                // Send the loading embed
                const loadingMessage = yield message.reply({ embeds: [loadingEmbed] });
                // Wait for 3 seconds
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    let gameInstructionsEmbed;
                    switch (option) {
                        case '1':
                            gameInstructionsEmbed = new discord_js_1.EmbedBuilder()
                                .setColor('#0099ff')
                                .setTitle('Number Guessing Game')
                                .setDescription('Welcome to the Number Guessing Game! Here\'s how to play: \nJust guess the numbers. \nClosing and Starting the game in 3s...');
                            break;
                        case '2':
                            gameInstructionsEmbed = new discord_js_1.EmbedBuilder()
                                .setColor('#0099ff')
                                .setTitle('Quiz Game')
                                .setDescription('Welcome to the Quiz Game! Here\'s how to play: \nAnswer the correct questions, Simple Dimple! \nClosing and Starting the game in 3s...');
                            break;
                        case '3':
                            gameInstructionsEmbed = new discord_js_1.EmbedBuilder()
                                .setColor('#0099ff')
                                .setTitle('Memory Game')
                                .setDescription('Welcome to the Memory Game! Here\'s how to play: \nUse your brain to memorize the things. \nClosing and Starting the game in 3s...');
                            break;
                        case '4':
                            gameInstructionsEmbed = new discord_js_1.EmbedBuilder()
                                .setColor('#0099ff')
                                .setTitle('Match-3 Game')
                                .setDescription('Welcome to the Match-3 Game! Here\'s how to play: \nSwap adjacent items to match 3 or more in a row. \nClosing and Starting the game in 3s...');
                            break;
                    }
                    // Edit the loading message to display the game instructions embed
                    yield loadingMessage.edit({ embeds: [gameInstructionsEmbed] });
                }), 3000);
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    switch (option) {
                        case '1':
                            // Generate a random number between 1 and 100
                            const randomNumber = Math.floor(Math.random() * 100) + 1;
                            // Set up a variable to track the number of attempts
                            let attempts = 0;
                            yield message.channel.send('I\'m thinking a number between 1 and 100.');
                            const numberCollector = message.channel.createMessageCollector({
                                filter: (response) => !isNaN(Number(response.content)) && response.author.id === message.author.id,
                                time: 60000, // 60 seconds
                                max: 10 // Maximum of 10 attempts
                            });
                            numberCollector.on('collect', (msg) => __awaiter(this, void 0, void 0, function* () {
                                const guessedNumber = parseInt(msg.content);
                                // Increment the attempts
                                attempts++;
                                if (guessedNumber === randomNumber) {
                                    numberCollector.stop();
                                    const winEmbed = new discord_js_1.EmbedBuilder()
                                        .setColor('#00ff00')
                                        .setTitle('Number Guessing Game')
                                        .setDescription(`Congratulations! You guessed the correct number (${randomNumber}) in ${attempts} attempts!`);
                                    yield message.channel.send({ embeds: [winEmbed] });
                                    // Award Resonance Coins
                                    awardCoins(message.author.id, 10);
                                }
                                else {
                                    if (guessedNumber > randomNumber) {
                                        yield message.channel.send('Too high! Try again.');
                                    }
                                    else {
                                        yield message.channel.send('Too low! Try again.');
                                    }
                                }
                            }));
                            numberCollector.on('end', (collected, reason) => __awaiter(this, void 0, void 0, function* () {
                                if (reason === 'time') {
                                    const timeoutEmbed = new discord_js_1.EmbedBuilder()
                                        .setColor('#ff0000')
                                        .setTitle('Number Guessing Game')
                                        .setDescription('Sorry, you ran out of time! The game is over.');
                                    yield message.channel.send({ embeds: [timeoutEmbed] });
                                }
                            }));
                            break;
                        case '2':
                            // Select a random question
                            const randomQuestion = quizQuestions[Math.floor(Math.random() * quizQuestions.length)];
                            // Send the question to the user
                            yield message.channel.send(randomQuestion.question);
                            // Set up a collector to listen for the answer
                            const answerCollector = message.channel.createMessageCollector({
                                filter: (response) => response.content.toLowerCase() === randomQuestion.answer.toLowerCase() && response.author.id === message.author.id,
                                time: 30000, // 30 seconds
                                max: 1 // Only allow one answer
                            });
                            answerCollector.on('collect', () => __awaiter(this, void 0, void 0, function* () {
                                const winEmbed = new discord_js_1.EmbedBuilder()
                                    .setColor('#00ff00')
                                    .setTitle('Quiz Game')
                                    .setDescription('Congratulations! You answered correctly!');
                                yield message.channel.send({ embeds: [winEmbed] });
                                // Award Resonance Coins
                                awardCoins(message.author.id, 10);
                                answerCollector.stop();
                            }));
                            answerCollector.on('end', (collected, reason) => __awaiter(this, void 0, void 0, function* () {
                                if (reason === 'time') {
                                    const timeoutEmbed = new discord_js_1.EmbedBuilder()
                                        .setColor('#ff0000')
                                        .setTitle('Quiz Game')
                                        .setDescription('Sorry, you ran out of time! The correct answer was: ' + randomQuestion.answer);
                                    yield message.channel.send({ embeds: [timeoutEmbed] });
                                }
                            }));
                            break;
                        case '3':
                            // Define memory game items
                            const memoryItems = ['Apple', 'Banana', 'Orange', 'Grapes', 'Watermelon', 'Pineapple'];
                            // Shuffle the items
                            const shuffledItems = memoryItems.sort(() => Math.random() - 0.5);
                            // Create an image from the shuffled items
                            const memoryImage = yield createMemoryImage(shuffledItems);
                            // Send the image to the user
                            const memoryEmbed = new discord_js_1.EmbedBuilder()
                                .setColor('#00ff00')
                                .setTitle('Memory Game')
                                .setDescription('Remember the order of the items below:');
                            yield message.channel.send({ embeds: [memoryEmbed], files: [{ attachment: memoryImage, name: 'memory.png' }] });
                            // Wait for 10 seconds for the user to memorize the items
                            yield new Promise(resolve => setTimeout(resolve, 10000));
                            // Clear the chat (only in a guild channel, not in a DM)
                            if (message.channel instanceof discord_js_1.TextChannel) {
                                const fetchedMessages = yield message.channel.messages.fetch({ limit: 1 });
                                yield message.channel.bulkDelete(fetchedMessages);
                            }
                            // Prompt the user to recall the items
                            yield message.channel.send('Type the items you remembered, separated by commas (e.g., Apple, Banana, Orange)');
                            // Set up a collector to listen for the user's response
                            const memoryCollector = message.channel.createMessageCollector({
                                filter: (response) => response.author.id === message.author.id,
                                time: 30000, // 30 seconds
                                max: 1 // Only allow one response
                            });
                            memoryCollector.on('collect', (msg) => __awaiter(this, void 0, void 0, function* () {
                                const userItems = msg.content.toLowerCase().split(',').map(item => item.trim());
                                const correctItems = shuffledItems.map(item => item.toLowerCase());
                                if (JSON.stringify(userItems.sort()) === JSON.stringify(correctItems.sort())) {
                                    const winEmbed = new discord_js_1.EmbedBuilder()
                                        .setColor('#00ff00')
                                        .setTitle('Memory Game')
                                        .setDescription('Congratulations! You remembered all the items correctly!');
                                    yield message.channel.send({ embeds: [winEmbed] });
                                    // Award Resonance Coins
                                    awardCoins(message.author.id, 10);
                                }
                                else {
                                    const loseEmbed = new discord_js_1.EmbedBuilder()
                                        .setColor('#ff0000')
                                        .setTitle('Memory Game')
                                        .setDescription('Sorry, you got some items wrong! Better luck next time.');
                                    yield message.channel.send({ embeds: [loseEmbed] });
                                }
                                memoryCollector.stop();
                            }));
                            memoryCollector.on('end', (collected, reason) => __awaiter(this, void 0, void 0, function* () {
                                if (reason === 'time') {
                                    const timeoutEmbed = new discord_js_1.EmbedBuilder()
                                        .setColor('#ff0000')
                                        .setTitle('Memory Game')
                                        .setDescription('Sorry, you ran out of time! The game is over.');
                                    yield message.channel.send({ embeds: [timeoutEmbed] });
                                }
                            }));
                            break;
                        case '4':
                            // Match-3 game logic
                            let grid = createGrid(5, 4);
                            grid = shuffleGrid(grid);
                            let firstSelection = null;
                            let secondSelection = null;
                            const gridButtons = displayGridAsButtons(grid);
                            const gridMessage = yield message.channel.send({
                                content: 'Match-3 Game: Click two adjacent items to swap them.',
                                components: gridButtons
                            });
                            const matchCollector = message.channel.createMessageComponentCollector({
                                filter: (interaction) => interaction.isButton() && interaction.user.id === message.author.id,
                                time: 60000 // 60 seconds
                            });
                            matchCollector.on('collect', (interaction) => __awaiter(this, void 0, void 0, function* () {
                                if (!interaction.isButton())
                                    return;
                                const [_, row, col] = interaction.customId.split('_').map(Number);
                                if (firstSelection === null) {
                                    firstSelection = [row, col];
                                }
                                else {
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
                                            const winEmbed = new discord_js_1.EmbedBuilder()
                                                .setColor('#00ff00')
                                                .setTitle('Match-3 Game')
                                                .setDescription('Congratulations! You made a match of 3 or more items!');
                                            yield message.channel.send({ embeds: [winEmbed] });
                                            // Award Resonance Coins
                                            awardCoins(message.author.id, 10);
                                        }
                                        else {
                                            // Update the grid display
                                            const updatedGridButtons = displayGridAsButtons(grid);
                                            yield gridMessage.edit({ components: updatedGridButtons });
                                        }
                                    }
                                    else {
                                        yield interaction.reply({ content: 'Items are not adjacent. Please select adjacent items.', ephemeral: true });
                                    }
                                    // Reset selections
                                    firstSelection = null;
                                    secondSelection = null;
                                }
                            }));
                            matchCollector.on('end', (collected, reason) => __awaiter(this, void 0, void 0, function* () {
                                if (reason === 'time') {
                                    const timeoutEmbed = new discord_js_1.EmbedBuilder()
                                        .setColor('#ff0000')
                                        .setTitle('Match-3 Game')
                                        .setDescription('Sorry, you ran out of time! The game is over.');
                                    yield message.channel.send({ embeds: [timeoutEmbed] });
                                }
                            }));
                            break;
                    }
                }), 3000);
            }
            else {
                // Add the user to the set indicating they have accessed the game menu
                gameMenuAccessed.add(message.author.id);
                const gameSelectionEmbed = new discord_js_1.EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle('Game Selection')
                    .setDescription('Please select a game from the list below.')
                    .addFields({ name: '```1. Number Guessing Game```', value: '`===============`' }, { name: '```2. Quiz Game```', value: '`===============`' }, { name: '```3. Memory Game```', value: '`===============`' }, { name: '```4. Match-3 Game```', value: '`===============`' }, {
                    name: 'Usage:',
                    value: '`!game <option>` || Example usage: `!game 1`'
                });
                yield message.reply({ embeds: [gameSelectionEmbed] });
            }
        });
    }
};
// Helper function to award Resonance Coins
const awardCoins = (userId, amount) => {
    const filePath = path.join(__dirname, './json/resonanceCoins.json');
    let resonanceCoins = {};
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        resonanceCoins = JSON.parse(data);
    }
    catch (err) {
        console.error('Error reading resonanceCoins.json:', err);
    }
    if (!resonanceCoins[userId]) {
        resonanceCoins[userId] = 0;
    }
    resonanceCoins[userId] += amount;
    try {
        fs.writeFileSync(filePath, JSON.stringify(resonanceCoins, null, 2), 'utf8');
    }
    catch (err) {
        console.error('Error writing to resonanceCoins.json:', err);
    }
};
