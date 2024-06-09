"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = require("dotenv");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
(0, dotenv_1.config)();
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
    ],
    presence: {
        activities: [{
                name: '!help',
                type: discord_js_1.ActivityType.Playing
            }],
    },
});
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
    try {
        const command = require(`./commands/${commandName}`);
        if (command) {
            try {
                command.execute(message, args);
            }
            catch (error) {
                console.error(error);
                message.reply('There was an error trying to execute that command!');
            }
        }
        else {
            message.reply('Unavailable command.');
        }
    }
    catch (error) {
        if (isModuleNotFoundError(error)) {
            message.reply('Unavailable command.');
        }
        else {
            console.error(error);
            message.reply('There was an error trying to execute that command!');
        }
    }
});
client.on('interactionCreate', (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!interaction.isButton())
        return;
    const commandName = (_a = interaction.message.interaction) === null || _a === void 0 ? void 0 : _a.commandName;
    if (commandName) {
        try {
            const command = require(`./commands/${commandName}`);
            if (command && command.handleInteraction) {
                yield command.handleInteraction(interaction);
            }
        }
        catch (error) {
            console.error(error);
            yield interaction.reply({ content: 'There was an error handling this interaction!', ephemeral: true });
        }
    }
}));
function isModuleNotFoundError(error) {
    return typeof error === 'object' && error !== null && 'code' in error && error.code === 'MODULE_NOT_FOUND';
}
client.login(process.env.DISCORD_TOKEN);
