// import { Client, GatewayIntentBits, ActivityType } from 'discord.js';
// import { config } from 'dotenv';
// import path from 'path';
// import fs from 'fs';

// config();

// const client = new Client({
//   intents: [
//     GatewayIntentBits.Guilds,
//     GatewayIntentBits.GuildMessages,
//     GatewayIntentBits.MessageContent,
//   ],
//   presence: {
//     activities: [{
//       name: '!help',
//       type: ActivityType.Playing
//     }],
//   },
// });

// const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.ts'));
// const eventFiles = fs.readdirSync(path.join(__dirname, 'events')).filter(file => file.endsWith('.ts'));

// for (const file of eventFiles) {
//   const event = require(`./events/${file}`);
//   if (event.once) {
//     client.once(event.name, (...args) => event.execute(...args));
//   } else {
//     client.on(event.name, (...args) => event.execute(...args));
//   }
// }

// client.on('messageCreate', message => {
//   if (!message.content.startsWith('!') || message.author.bot) return;

//   const args = message.content.slice(1).split(/ +/);
//   const commandName = args.shift()?.toLowerCase();

//   try {
//     const command = require(`./commands/${commandName}`);
//     if (command) {
//       try {
//         command.execute(message, args);
//       } catch (error) {
//         console.error(error);
//         message.reply('There was an error trying to execute that command!');
//       }
//     } else {
//       message.reply('Unavailable command.');
//     }
//   } catch (error) {
//     if (isModuleNotFoundError(error)) {
//       message.reply('Unavailable command.');
//     } else {
//       console.error(error);
//       message.reply('There was an error trying to execute that command!');
//     }
//   }
// });

// // Remove this section as it's already handled by the eventFiles loop
// // client.on('messageDelete', message => {
// //   const deletedMessage = message as Message;
// //   checkDeletedMessages.execute(deletedMessage);
// // });

// client.on('interactionCreate', async interaction => {
//   if (!interaction.isButton()) return;

//   const commandName = interaction.message.interaction?.commandName;

//   if (commandName) {
//     try {
//       const command = require(`./commands/${commandName}`);
//       if (command && command.handleInteraction) {
//         await command.handleInteraction(interaction);
//       }
//     } catch (error) {
//       console.error(error);
//       await interaction.reply({ content: 'There was an error handling this interaction!', ephemeral: true });
//     }
//   }
// });

// function isModuleNotFoundError(error: unknown): error is NodeJS.ErrnoException {
//   return typeof error === 'object' && error !== null && 'code' in error && (error as any).code === 'MODULE_NOT_FOUND';
// }

// client.login(process.env.DISCORD_TOKEN);


import { Client, GatewayIntentBits, ActivityType } from 'discord.js';
import { config } from 'dotenv';
import path from 'path';
import fs from 'fs';

config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  presence: {
    activities: [{
      name: '!help',
      type: ActivityType.Playing
    }],
  },
});

const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.ts'));
const eventFiles = fs.readdirSync(path.join(__dirname, 'events')).filter(file => file.endsWith('.ts'));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

client.on('messageCreate', message => {
  if (!message.content.startsWith('!') || message.author.bot) return;

  const args = message.content.slice(1).split(/ +/);
  const commandName = args.shift()?.toLowerCase();

  try {
    const command = require(`./commands/${commandName}`);
    if (command) {
      try {
        command.execute(message, args);
      } catch (error) {
        console.error(error);
        message.reply('There was an error trying to execute that command!');
      }
    } else {
      message.reply('Unavailable command.');
    }
  } catch (error) {
    if (isModuleNotFoundError(error)) {
      message.reply('Unavailable command.');
    } else {
      console.error(error);
      message.reply('There was an error trying to execute that command!');
    }
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  const commandName = interaction.message.interaction?.commandName;

  if (commandName) {
    try {
      const command = require(`./commands/${commandName}`);
      if (command && command.handleInteraction) {
        await command.handleInteraction(interaction);
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error handling this interaction!', ephemeral: true });
    }
  }
});

function isModuleNotFoundError(error: unknown): error is NodeJS.ErrnoException {
  return typeof error === 'object' && error !== null && 'code' in error && (error as any).code === 'MODULE_NOT_FOUND';
}

client.login(process.env.DISCORD_TOKEN);
