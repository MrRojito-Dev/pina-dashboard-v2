require('dotenv').config();
const Dashboard = require("./src/dashboard.js");
const config = require("./config.js");
const models = {};

const { Client, Intents} = require('discord.js');
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES],
});

client.models = models;
client.config = config;

client.on("ready", async () => {
    console.log(`Discord App is ready. (${client.guilds.cache.size} Guilds)`);
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