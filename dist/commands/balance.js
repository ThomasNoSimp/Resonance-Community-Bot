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
const discord_js_1 = require("discord.js");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const resonanceCoinsFilePath = path.join(__dirname, 'json', 'resonanceCoins.json');
const ensureResonanceCoinsFileExists = () => {
    const dir = path.dirname(resonanceCoinsFilePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(resonanceCoinsFilePath)) {
        fs.writeFileSync(resonanceCoinsFilePath, JSON.stringify({}, null, 2), 'utf8');
    }
};
const loadResonanceCoins = () => {
    ensureResonanceCoinsFileExists();
    try {
        const data = fs.readFileSync(resonanceCoinsFilePath, 'utf8');
        return JSON.parse(data);
    }
    catch (err) {
        console.error('Error reading resonanceCoins.json:', err);
        return {};
    }
};
const saveResonanceCoins = (resonanceCoins) => {
    try {
        fs.writeFileSync(resonanceCoinsFilePath, JSON.stringify(resonanceCoins, null, 2), 'utf8');
    }
    catch (err) {
        console.error('Error writing to resonanceCoins.json:', err);
    }
};
module.exports = {
    name: 'balance',
    description: 'Check your coin balance',
    execute(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (message.author.bot)
                return;
            const resonanceCoins = loadResonanceCoins();
            const mentionedUser = message.mentions.users.first();
            const userId = mentionedUser ? mentionedUser.id : message.author.id;
            const userName = mentionedUser ? mentionedUser.username : message.author.username;
            const userCoins = resonanceCoins[userId] || 0;
            const balanceEmbed = new discord_js_1.EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(`${userName}'s Coin Balance`)
                .setDescription(`You have ${userCoins} Resonance Coins.`);
            yield message.reply({ embeds: [balanceEmbed] });
        });
    },
};
