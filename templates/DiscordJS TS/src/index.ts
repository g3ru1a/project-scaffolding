import Discord from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

const client = new Discord.Client();

client.on("ready", () => {

});

client.on("message", (message) => {

});

client.on("guildCreate", (guild) => {

});

client.on("guildDelete", (guild) => {

});

client.login(process.env.BOT_TOKEN!);