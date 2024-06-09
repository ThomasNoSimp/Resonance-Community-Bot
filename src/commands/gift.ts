import { Message } from 'discord.js';
import path from 'path';
import fs from 'fs';

const coinsFilePath = path.join(__dirname, 'json', 'resonanceCoins.json');

function readCoins() {
  const data = fs.readFileSync(coinsFilePath, 'utf8');
  return JSON.parse(data);
}

function writeCoins(coins: any) {
  fs.writeFileSync(coinsFilePath, JSON.stringify(coins, null, 2));
}

function updateCoins(userId: string, amount: number) {
  const coins = readCoins();
  coins[userId] = (coins[userId] || 0) + amount;
  writeCoins(coins);
}

export const execute = (message: Message, args: string[]) => {
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
