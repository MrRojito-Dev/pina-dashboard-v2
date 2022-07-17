require('dotenv').config();
module.exports = {
    port: 8080,
    prefix: "!",
    id: process.env.CLIENT_ID,
    usingCustomDomain: false,
    domain: process.env.URL,
    discordInvite: "https://discord.gg/mCrz7GUFen",
    mongodbUrl: process.env.MONGODB,
    clientSecret: process.env.CLIENT_SECRET,
    token: process.env.DISCORD_TOKEN,
};