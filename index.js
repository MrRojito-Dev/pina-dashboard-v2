require('dotenv').config();
const Dashboard = require("./src/dashboard.js");
const config = require("./config.js");
const models = {
    reports: require('./src/database/models/reports.js'),
};

const { Client, Intents} = require('discord.js');
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES],
});

client.models = models;
client.config = config;

client.on("ready", async () => {
    console.log("Fetching members...");
    for (const [id, guild] of client.guilds.cache) {
      await guild.members.fetch();
    }
    console.log("Fetched members.");
  
    console.log(`Bot is ready. (${client.guilds.cache.size} Guilds - ${client.channels.cache.size} Channels - ${client.users.cache.size} Users)`);
  
    Dashboard(client);
});

// Listening for error & warn events.
client.on("error", console.error);
client.on("warn", console.warn);

// Discord Login
client.login(config.token)
.then(() => {
    console.log(`sesión iniciada en Discord como ${client.user.tag}`)
    /* require('./database/connect.js').then(() => console.log(`Connected to the database`)); */
})
.catch((err) => console.error(err));