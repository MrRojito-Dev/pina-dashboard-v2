const express = require('express');
const router = express.Router();
const CheckAuth = require('../utils/auth');
const utils = require('../utils/utils');
const fetch = require("node-fetch");

router.use(CheckAuth, async (req, res, next) => {
  try {
    const bot_thing = await utils.getBotGuilds(req.user.guilds);
    const toshow = utils.getGuilds(bot_thing, req.user.guilds);
    req.user.toShowGuilds = toshow;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).redirect("/");
  }
});

router.get('/', async (req, res) => {
  const user = await req.client.users.fetch(req.user.id);

  const adminguilds = req.user.guilds.filter(e => utils.getPermissions(e.permissions).get("MANAGE_GUILD"));
  const guildsBotIn = req.user.toShowGuilds;
  const guildsBotNotIn = adminguilds.filter(x => !guildsBotIn.map(g => g.id).includes(x.id));

  res.render('dashboard/dashboard', {
    user: user,
    guildsBotIn,
    guildsBotNotIn,
    title: "Piña Bot",
    load: false
  });
});

router.get("/:guildID", async (req, res) => {
  const user = await req.client.users.fetch(req.user.id);
  const guild = req.user.toShowGuilds.find(e => e.id === req.params.guildID);

  const guildSettings = await fetch(`${process.env.FETCH}/guilds/${req.params.guildID}`, {
    method: "GET",
    headers: {
      "pass": `${process.env.ACCESS}`
    }
  });

  res.render("dashboard/guild", {
    title: "Piña Bot",
    user,
    guild,
    guildSettings: guildSettings.ok ? await guildSettings.json() : null
  });
});

module.exports = router;
