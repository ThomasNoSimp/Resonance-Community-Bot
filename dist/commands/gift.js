"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const coinsFilePath = path_1.default.join(__dirname, 'json', 'resonanceCoins.json');
function readCoins() {
    const data = fs_1.default.readFileSync(coinsFilePath, 'utf8');
    return JSON.parse(data);
}
function writeCoins(coins) {
    fs_1.default.writeFileSync(coinsFilePath, JSON.stringify(coins, null, 2));
}
function updateCoins(userId, amount) {
    const coins = readCoins();
    coins[userId] = (coins[userId] || 0) + amount;
    writeCoins(coins);
}
const execute = (message, args) => {
    if (args.length < 2) {
        return message.reply('Usage: !gift <amount> @user');
    }
    const amount = parseInt(args[0], 10);
    const userToGift = message.mentions.users.first();
    if (isNaN(amount) || amount <= 0) {
        return message.reply('Please specify a valid amount of coins to gift.');
    }
    if (!userToGift) {
        return message.reply('Please mention a user to gift the coins to.');
    }
    const senderId = message.author.id;
    const receiverId = userToGift.id;
    if (senderId === receiverId) {
        return message.reply('You cannot gift coins to yourself.');
    }
    const coins = readCoins();
    if (!coins[senderId] || coins[senderId] < amount) {
        return message.reply('You do not have enough coins to gift.');
    }
    // Deduct coins from the sender
    coins[senderId] -= amount;
    // Add coins to the receiver
    coins[receiverId] = (coins[receiverId] || 0) + amount;
    writeCoins(coins);
    message.reply(`Successfully gifted ${amount} coins to ${userToGift.tag}.`);
};
exports.execute = execute;
