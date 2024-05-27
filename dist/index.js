"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = require("dotenv");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
(0, dotenv_1.config)();
const client = new discord_js_1.Client({ intents: [discord_js_1.GatewayIntentBits.Guilds, discord_js_1.GatewayIntentBits.GuildMessages, discord_js_1.GatewayIntentBits.MessageContent] });
const commandFiles = fs_1.default.readdirSync(path_1.default.join(__dirname, 'commands')).filter(file => file.endsWith('.ts'));
const eventFiles = fs_1.default.readdirSync(path_1.default.join(__dirname, 'events')).filter(file => file.endsWith('.ts'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    }
    else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}
client.on('messageCreate', message => {
    var _a;
    if (!message.content.startsWith('!') || message.author.bot)
        return;
    const args = message.content.slice(1).split(/ +/);
    const commandName = (_a = args.shift()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    const command = require(`./commands/${commandName}`);
    if (command) {
        try {
            command.execute(message, args);
        }
        catch (error) {
            console.error(error);
            message.reply('there was an error trying to execute that command!');
        }
    }
});
client.login(process.env.DISCORD_TOKEN);
